import { useState } from 'react';
import { Popup, Marker, Polygon, Tooltip} from 'react-leaflet';
import { Scooter, Zone } from '../helpers/map/leaflet-types'
import RentButtonMarker from './RentButtonMarker';


export default function MarkerBoosted( {id, batteryLevel, latitude, longitude, status} : Scooter) {
    const [showRentButton, setShowRentButton] = useState(true);


    return (
        <Marker position={[latitude, longitude] }>
        <div data-testid="marker"></div>
        <Popup>
            <p>Id: {id} </p>
            <p>BatteryLevel: {batteryLevel} </p>
            { showRentButton ?
                <>
                    <p>Status: {status} </p>
                    <RentButtonMarker bikeId={id} showRentButton={showRentButton} setShowRentButton={setShowRentButton}/>
                </>
                :
                <p>Status: Was just rented </p>
            }
        </Popup>
        </Marker>
    )
}
