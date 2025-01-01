import { MapContainer, TileLayer} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { LatLngTuple,  LatLngExpression } from 'leaflet';
import { API_URL} from '../helpers/config';
import axios from 'axios';
import { Scooter,  Zone } from '../helpers/map/leaflet-types'
import { useParams } from "react-router-dom";
import { cities } from '../helpers/map/cities';
import MapCenter from './MapCenter';
import { renderScooterMarkers, renderStationMarkers, renderPolygons } from '../helpers/map/renders';

export default function Map() {
    const { city }  = useParams();
    const [startPosition, setStartPosition] = useState<LatLngExpression>([59.2741, 15.2066]);
    const [scooterData, setScooterData] = useState<Scooter[]>([]);
    const [zoneData, setZoneData] = useState<Zone[]>([]);
    const zoom = 11;
    const stationPositions: LatLngTuple[] = [[51.505, -0.04],[51.515, -0.15],[51.535, -0.08]];

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
      },[])
    
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
      },[])

    
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
                    {renderStationMarkers(stationPositions)}
                    {renderPolygons(zoneData)}
                </MapContainer>
            </div>
            <div id="scooter-list" className="mt-4 bg-gray-600 rounded">
                <h2 className="text-xl font-bold mb-2">Cyklar i {city}:</h2>
                {scooterData.length > 0 ? (
                    <ul className="list-disc pl-6 list-none">
                        {scooterData.map((scooter) => (
                            <li key={scooter.id} className="mb-2">
                                <div className="mt-4 p-6 mx-auto w-1/2 hover:opacity-5 bg-gray-400 rounded text-center">
                                <h2><span className="font-semibold">ID:</span> {scooter.id} -{" "}</h2>
                                <span className="font-semibold">Batteri:</span> {scooter.batteryLevel}% -{" "}
                                <span className="font-semibold">Status:</span> {scooter.status} -{" "}
                                <span className="font-semibold">Longitud:</span> {scooter.longitude} -{" "}
                                <span className="font-semibold">Latitud:</span> {scooter.latitude}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Inga cyklar tillgängliga i denna stad.</p>
                )}
            </div>
        </div>
  )
};
