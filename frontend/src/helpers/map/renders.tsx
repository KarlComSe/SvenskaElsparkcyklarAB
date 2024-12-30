import { Popup, Marker, Polygon, Tooltip} from 'react-leaflet';
import { Scooter, Zone } from './leaflet-types'
import { LatLngTuple } from 'leaflet';
import { iconStation } from '../config';


const renderScooterMarkers = (scooterData: Scooter[])=>   (
    scooterData?.map((scooter, index) => (
    <Marker key={index} position={[scooter.latitude, scooter.longitude]}>
        <Popup>
            <p>Id: { scooter.id} </p>
            <p>BatteryLevel: { scooter.batteryLevel} </p>
            <p>Status: { scooter.status} </p>
        </Popup>
    </Marker>))
    );

const renderStationMarkers  = (stationPositions: LatLngTuple[]) =>  (
    stationPositions?.map((position, index) => (
    <Marker key={index} position={position} icon={iconStation}>
        <Popup>
        { position }
        </Popup>
    </Marker>))
    );

const renderPolygons = ( zoneData: Zone[] ) =>  (
    zoneData?.map((zone, index) => (
        <Polygon pathOptions={{ color: "red "}} positions={zone.polygon.map(point => [point.lat, point.lng])} key={index}>
            <Tooltip direction="bottom" offset={[0, 20]} opacity={1} >
                <p>Id: {zone.id}</p>
                <p>Type: {zone.type}</p>
            </Tooltip>
        </Polygon>
    ))
);

export { renderScooterMarkers, renderStationMarkers, renderPolygons }
