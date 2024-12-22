export const API_URL = "http://localhost:3535";

const githubAuthUrl = 'https://github.com/login/oauth/authorize';
const clientId = 'Ov23liY1kaJ2acYLtBhq';
const redirectUri = 'http://localhost:5173/github/callback';
const scope = 'user:email';
import markerIcon from '../assets/images/station.png';
export const GITHUB_URL = `${githubAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
import L from 'leaflet';

export const getHeader = (token: string, contentType?: string ) => {
    const config = {
        headers: {
            "Content-type" : contentType || "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    return config;
 }

 
 export const iconStation = new L.Icon({
    iconUrl: markerIcon,
    iconSize:     [38, 38], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
});
