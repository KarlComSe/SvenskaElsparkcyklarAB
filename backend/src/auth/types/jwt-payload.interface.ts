export interface JwtPayload {
  sub: string; // githubId
  username: string;
  email: string;
  roles: string[];
}
