import { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer} from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Zone } from '../helpers/map/leaflet-types'
import { Scooter } from '../helpers/bike-functions';
import { cities } from '../helpers/map/cities';
import MapCenter from './MapCenter';
import { renderScooterMarkers, renderPolygons } from '../helpers/map/renders';
import RealTimeContext from '../helpers/RealTimeContext';

type propTypes = {
    city: string;
    zoneData: Zone[];
    scooterData: Scooter[]
    isLowRes?: boolean
}

export default function Map({city, zoneData, scooterData} : propTypes) {

    const [startPosition, setStartPosition] = useState<LatLngExpression>([-48.876667, -123.393333]);
    const zoom = 11;
    const { isLowRes } = useContext(RealTimeContext);

    useEffect(() => {
        if (city && cities[city]) {
            setStartPosition(cities[city]);
        }
    }, [city, zoneData, scooterData]);
    
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
                    {renderScooterMarkers(scooterData, isLowRes)}
                    {renderPolygons(zoneData)}
                </MapContainer>
            </div>
           
        </div>
  )
};
