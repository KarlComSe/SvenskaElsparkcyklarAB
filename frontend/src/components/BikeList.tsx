import { useEffect, useState, useContext } from 'react';
import { Scooter } from '../helpers/bike-functions';
import { Badge } from 'flowbite-react'
import RealTimeContext from '../helpers/RealTimeContext';
import { formatTimestamp } from '../helpers/other-functions';

type Props = {
    scooterData: Scooter[];
    isCityList: boolean,
    isLowRes?: boolean
}

export default function BikeList( {scooterData, isCityList} : Props) {

    const [scootersString, setScootersString] = useState("")
    const { isLowRes } = useContext(RealTimeContext);

    useEffect(() => {
        const scooterDataString = scooterData.map(scooter => 
        Object.values(scooter).filter(value => typeof value !== 'object').join(' | ')
            ).join('<br />');
        setScootersString(scooterDataString);
    },[scooterData]);
    
  return !isLowRes ? (
  <ul className="w-full sm:max-w-4xl mx-auto" data-testid="bikelist">
    {scooterData.map((scooter) => (
        <li key={scooter.id} className="flex flex-col w-full flex-nowrap justify-between gap-4 p-4 mb-6 bg-gray-100 rounded-lg
                shadow-md sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">id:</span>
                        <Badge>{scooter.id}</Badge>
                    </div>
                    { isCityList &&
                        <div className="flex items-center p-1 rounded-lg">
                            <span className="font-semibold">city:</span>
                            <Badge>{scooter.city}</Badge>
                        </div>
                    }
                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">createdAt:</span>
                        <Badge>{formatTimestamp(scooter.createdAt)}</Badge>
                    </div>

                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">updatedAt:</span>
                        <Badge>{formatTimestamp(scooter.updatedAt)}</Badge>
                    </div>
                </div>

                <div>
                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">batteryLevel:</span>
                        <Badge>{scooter.batteryLevel}</Badge>
                    </div>

                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">status:</span>
                        <Badge>{scooter.status}</Badge>
                    </div>

                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">longitude:</span>
                        <Badge>{scooter.longitude}</Badge>
                    </div>

                    <div className="flex items-center p-1 rounded-lg">
                        <span className="font-semibold">latitude:</span>
                        <Badge>{scooter.latitude}</Badge>
                    </div>
                </div>
            </li>
            ))}
            </ul>
        ) :
        (
        <div dangerouslySetInnerHTML={{ __html: scootersString }} />
    )
}
