import { GithubUser } from './github-user.interface';
export interface AuthResponse {
    access_token: string;
    user: GithubUser;
}
