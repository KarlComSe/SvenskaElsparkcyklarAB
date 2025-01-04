import { Popup, Marker, Polygon, Tooltip} from 'react-leaflet';
import { Scooter, Zone } from './leaflet-types'
import { LatLngTuple } from 'leaflet';
import { iconStation } from '../config';
import { giveMarkerPin } from '../config';

const zoneColors = (zoneType: string) => {
    switch(zoneType) {
        case "speed":
            return {color :"purple"}
        case "parking":
            return {color :"green"}
        case "charging":
            return {color :"blue"}
        default:
            return {color :"red"}
    }
}

const renderScooterMarkers = (scooterData: Scooter[])=>   (
    scooterData?.map((scooter, index) => (
    <Marker key={index} icon={giveMarkerPin(index)} position={[scooter.latitude, scooter.longitude]}>
        <Popup>
            <p className="my-0 py-0">id: {scooter.id}</p>
            <p className="my-0 py-0">batteryLevel: {scooter.batteryLevel}</p>
            <p className="my-0 py-0">status: {scooter.status}</p>
            <p className="my-0 py-0">longitude: {scooter.longitude}</p>
            <p className="my-0 py-0">latitude: {scooter.latitude}</p>
            <p className="my-0 py-0">updatedAt: {scooter.updatedAt}</p>
            <p className="my-0 py-0">createdAt: {scooter.createdAt}</p>
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
        <Polygon pathOptions={zoneColors(zone.type)} positions={zone.polygon.map(point => [point.lat, point.lng])} key={index}>
            <Tooltip direction="bottom" offset={[0, 20]} opacity={1} >
                <p>Name: {zone.name}</p>
                <p>Id: {zone.id}</p>
                <p>Type: {zone.type}</p>
                { zone.bikes && <p>Number of bikes: {zone.bikes?.length} </p> }

                <p></p>
            </Tooltip>
        </Polygon>
    ))
);

export { renderScooterMarkers, renderStationMarkers, renderPolygons }
