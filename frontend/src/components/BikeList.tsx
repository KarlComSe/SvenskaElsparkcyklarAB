import { Scooter } from '../helpers/map/leaflet-types'
import { Badge } from 'flowbite-react'

type Props = {
    scooterData: Scooter[];
    isCityList: boolean

}

export default function BikeList( {scooterData, isCityList} : Props) {
  return (
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
                            <Badge>{scooter.createdAt}</Badge>
                        </div>

                        <div className="flex items-center p-1 rounded-lg">
                            <span className="font-semibold">updatedAt:</span>
                            <Badge>{scooter.updatedAt}</Badge>
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
  )
}
