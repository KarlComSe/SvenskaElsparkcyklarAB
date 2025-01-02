import { MapContainer, TileLayer} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { API_URL} from '../helpers/config';
import axios from 'axios';
import { Scooter,  Zone } from '../helpers/map/leaflet-types'
import { cities } from '../helpers/map/cities';
import MapCenter from './MapCenter';
import { renderScooterMarkers, renderPolygons } from '../helpers/map/renders';

export default function Map({city} : {city: string}) {

    const [startPosition, setStartPosition] = useState<LatLngExpression>([-48.876667, -123.393333]);
    const [scooterData, setScooterData] = useState<Scooter[]>([]);
    const [zoneData, setZoneData] = useState<Zone[]>([]);
    const zoom = 11;
    // const stationPositions: LatLngTuple[] = [[51.505, -0.04],[51.515, -0.15],[51.535, -0.08]];

    useEffect(() => {
        if (city && cities[city]) {
            setStartPosition(cities[city]);
        }
    }, [city]);
    

    useEffect(() => {
        const fetchScooters = async() => {
        try {
                const response = await axios.get(`${API_URL}/bike/city/${city}`);
                setScooterData(response.data);
            }
            catch(error)
            {
            }
      }
      fetchScooters();
      },[city])
    
      useEffect(() => {
        const fetchZones = async() => {
        try {

                const response = await axios.get(`${API_URL}/zone/city/${city}`);
                setZoneData(response.data);
            }
            catch(error)
            {
            }
      }
      fetchZones();
      },[city])

    
  return (
    <div id="map-container">
            <div id="map" data-testid="map">
                <MapContainer
                    style={{ height: "400px" }}
                    center={startPosition}
                    zoom={zoom}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapCenter center={startPosition} zoom={zoom} />
                    {renderScooterMarkers(scooterData)}
                    {/* {renderStationMarkers(stationPositions)} */}
                    {renderPolygons(zoneData)}
                </MapContainer>
            </div>
           
        </div>
  )
};
