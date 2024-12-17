import { MapContainer, Popup, Marker, TileLayer, Polygon, useMap } from 'react-leaflet';
import React, { useEffect, useState } from 'react';
import { LatLngTuple,  LatLngExpression } from 'leaflet';
import { API_URL, getHeader, iconStation } from '../helpers/config';
import axios from 'axios';
import { RootState } from '../redux/store/store';
import { useDispatch, useSelector } from 'react-redux';

type Scooter = {
    id: string;
    batteryLevel: number;
    latitude: number;
    longitude: number;
    status: string;
  };

type PolygonPoint = {
    lat: number;
    lng: number;
  };

type SpeedZone = {
    id: string;
    speedLimit: number;
};

type Zone = {
    id: string;
    polygon: PolygonPoint[];
    type: 'parking' | 'charging' | 'speed';
    speedZone?: SpeedZone | null;
};

export default function Map() {
    const [startPosition, setStartPosition] = useState<LatLngExpression>([59.2741, 15.2066]);
    const {isLoggedIn, token, user, role} = useSelector((state: RootState) =>  state.auth);
    const [scooterData, setScooterData] = useState<Scooter[]>([]);
    const [zoneData, setZoneData] = useState<Zone[]>([]);
    // const scooterPositions: LatLngTuple[] = [
    // [51.505, -0.09],
    // [51.515, -0.1],
    // [51.525, -0.08]
    // ];

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
    const purpleOptions = { color: 'purple' }

    useEffect(() => {
        const fetchScooters = async() => {
        try {
    
                const response = await axios.get(`${API_URL}/bike`);
                console.log(response.data);
                const positions: LatLngTuple[] = [];
                setScooterData(response.data);
            }
            catch(error)
            {
                console.log(error);
            }
      }
      fetchScooters();
      },[])
    
      useEffect(() => {
        /////EJ FÄRDIG ÄN
        const fetchZones = async() => {
        try {
    
                const response = await axios.get(`${API_URL}/zone`);
                console.log(response.data);
                const positions: LatLngTuple[] = [];
                for (let key in response.data) {
                    if (response.data.hasOwnProperty(key)) {
                        // const latitude = response.data[key].latitude;
                        // const longitude = response.data[key].longitude;
                        // positions.push([latitude, longitude]);
                        // console.log(key, latitude, longitude);
                    }
                 }
                //  setScooterPosition(positions);
            }
            catch(error)
            {
                console.log(error);
            }
      }
      fetchZones();
      },[])

    
    const renderScooterMarkers = () => (
        scooterData?.map((scooter, index) => (
        <Marker key={index} position={[scooter.latitude, scooter.longitude]}>
            <Popup>
            <p>Id: { scooter.id} </p>
            <p>BatteryLevel: { scooter.batteryLevel} </p>
            <p>Status: { scooter.status} </p>
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
        <MapContainer style={{ height: "400px" }}  center={startPosition} zoom={6} scrollWheelZoom={true}>
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
