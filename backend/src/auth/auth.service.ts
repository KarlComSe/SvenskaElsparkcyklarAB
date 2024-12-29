import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { GithubUser } from './types/github-user.interface';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async exchangeGithubCode(code: string) {
    // console.log('Attempting exchange with code:', code);
    // console.log('Using client ID:', this.configService.get('OAUTH_CLIENT_ID'));

    const githubToken = await this.getGithubToken(code);
    const githubUser = await this.getGithubUser(githubToken);
    const user = await this.findOrCreateUser(githubUser);
    const token = this.createToken(user);

    return {
      access_token: token,
      user: {
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        roles: user.roles,
        hasAcceptedTerms: user.hasAcceptedTerms,
      },
    };
  }

  private async getGithubToken(code: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.configService.get('OAUTH_CLIENT_ID'),
          client_secret: this.configService.get('OAUTH_CLIENT_SECRET'),
          code,
        },
        {
          headers: { Accept: 'application/json' },
        },
      ),
    );
    return data.access_token;
  }

  private async getGithubUser(token: string): Promise<GithubUser> {
    const { data } = await firstValueFrom(
      this.httpService.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }),
    );
    return data;
  }

  private async findOrCreateUser(githubUser: GithubUser): Promise<User> {
    let user = await this.userRepository.findOne({
      where: { githubId: githubUser.id },
    });

    if (!user) {
      user = await this.userRepository.save(
        new User({
          githubId: githubUser.id,
          username: githubUser.login,
          email: githubUser.email,
          avatarUrl: githubUser.avatar_url,
          roles: ['user'],
        }),
      );
    }

    return user;
  }

  private createToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.githubId,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }

  async validateUserById(githubId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { githubId } });
  }

  async getStatus(user: User) {
    return {
      isAuthenticated: true,
      user: {
        githubId: user.githubId,
        username: user.username,
        email: user.email,
        roles: user.roles,
        hasAcceptedTerms: user.hasAcceptedTerms,
      },
    };
  }
}
