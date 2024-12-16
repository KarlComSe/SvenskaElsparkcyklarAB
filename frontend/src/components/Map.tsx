import { MapContainer, Popup, Marker, TileLayer, Polygon, useMap } from 'react-leaflet';
import React from 'react';
import { LatLngTuple,  LatLngExpression } from 'leaflet';
import L from 'leaflet';
import markerIcon from '../assets/images/station.png';
export default function Map() {


    const scooterPositions: LatLngTuple[] = [
    [51.505, -0.09],
    [51.515, -0.1],
    [51.525, -0.08]
    ];

    const stationPositions: LatLngTuple[] = [
        [51.505, -0.04],
        [51.515, -0.15],
        [51.535, -0.08]
        ];

    const multiPolygon:  LatLngExpression[][] = [
        [
          [51.51, -0.12],
          [51.51, -0.13],
          [51.53, -0.13],
        ],
        [
          [51.51, -0.05],
          [51.51, -0.07],
          [51.53, -0.07],
        ],
    ];

    const iconStation = new L.Icon({
        iconUrl: markerIcon,
        iconSize:     [38, 38], // size of the icon
        shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
    
    const purpleOptions = { color: 'purple' }
  
    const renderScooterMarkers = () => (
        scooterPositions?.map((position, index) => (
        <Marker key={index} position={position}>
            <Popup>
            { position }
            </Popup>
        </Marker>))
        );

        
    const renderStationMarkers = () => (
        stationPositions?.map((position, index) => (
        <Marker key={index} position={position} icon={iconStation}>
            <Popup>
            { position }
            </Popup>
        </Marker>))
        );

  return (
    <div id="map" data-testid="map">
        <MapContainer style={{ height: "400px" }}  center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { renderScooterMarkers() }
            { renderStationMarkers() }
            <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
        </MapContainer>
    </div>
  )
};
