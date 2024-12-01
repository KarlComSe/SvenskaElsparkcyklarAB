import { Strategy } from 'passport-github2';
declare const GithubStrategy_base: new (...args: any[]) => Strategy;
export declare class GithubStrategy extends GithubStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: any): Promise<{
        id: any;
        username: any;
        email: any;
        accessToken: string;
    }>;
}
export {};
