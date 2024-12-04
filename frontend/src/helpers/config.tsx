export const API_URL = "http://localhost:3535";

const githubAuthUrl = 'https://github.com/login/oauth/authorize';
const clientId = 'Ov23liY1kaJ2acYLtBhq';
const redirectUri = 'http://localhost:5173/github/callback';
const scope = 'user:email';

export const GITHUB_URL = `${githubAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

export const getHeader = (token: string, contentType?: string ) => {
    const config = {
        headers: {
            "Content-type" : contentType || "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return config;
 }
