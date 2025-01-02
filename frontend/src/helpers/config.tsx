export const API_URL = "http://localhost:3535/v1";

const githubAuthUrl = 'https://github.com/login/oauth/authorize';
const clientId = 'Ov23liY1kaJ2acYLtBhq';
const redirectUri = 'http://localhost:5173/github/callback';
const scope = 'user:email';
import markerIcon from '../assets/images/station.png';
import pinShadow from '../assets/images/marker-shadow.png';
import markerblack from '../assets/images/marker-icon-2x-black.png';
import markerblue from '../assets/images/marker-icon-2x-blue.png';
import markergreen from '../assets/images/marker-icon-2x-green.png';
import markergrey from '../assets/images/marker-icon-2x-grey.png';
import markerorange from '../assets/images/marker-icon-2x-orange.png';
import markerred from '../assets/images/marker-icon-2x-red.png';
import markerviolet from '../assets/images/marker-icon-2x-violet.png';
import markeryellow from '../assets/images/marker-icon-2x-yellow.png';



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


export function giveMarkerPin(index: number) {
    const markers = [
        markeryellow,
        markerblack,
        markerblue,
        markergreen,
        markergrey,
        markerorange,
        markerred,
        markerviolet ]

    const marker = markers[index % markers.length];

    return new L.Icon({
        iconUrl: marker,
        iconSize: [25, 41],          // Width and height of the icon
        iconAnchor: [12, 41],        // The "tip" of the icon (bottom-middle)
        popupAnchor: [1, -34],       // The point where the popup opens relative to the iconAnchor
        tooltipAnchor: [16, -28],    // The point where the tooltip opens relative to the iconAnchor
        shadowSize: [41, 41],        // Size of the shadow image
        shadowAnchor: [13, 41],  
    });
}