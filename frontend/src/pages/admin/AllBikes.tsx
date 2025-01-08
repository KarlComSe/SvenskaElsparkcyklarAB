
import { useEffect, useState } from 'react';

import { API_URL, getHeader} from '../../helpers/config';
import axios from 'axios';
import { Scooter,  Zone } from '../../helpers/map/leaflet-types'
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import AdminGate from '../../components/AdminGate';
import { Badge } from 'flowbite-react';


export default function AllBikes() {
    const [scooterData, setScooterData] = useState<Scooter[]>([]);
    const { token } = useSelector((state: RootState) =>  state.auth);

    useEffect(() => {
        const fetchScooters = async() => {
        try {
                const response = await axios.get(`${API_URL}/bike`, getHeader(token));
                setScooterData(response.data);
            }
            catch(error)
            {
            }
      }
      fetchScooters();
      },[])
    
  
  return (
            <div data-testid="all-scooter-list" className="p-4 flex flex-col justify-center w-full">
                <AdminGate/>
                <div className="mx-auto">
                <h2 className="text-4xl font-bold text-gray-900"> Alla cyklar </h2>
                </div>
                {scooterData.length > 0 ? (
                    <>
                    <div className="mx-auto mb-5">
                    <h2>Antal cyklar: <b>{scooterData.length}</b> </h2>
                    </div>
                    <ul className="w-full sm:max-w-4xl mx-auto">
                        {scooterData.map((scooter) => (
                                <li key={scooter.id} className="flex flex-col w-full flex-nowrap justify-between gap-4 p-4 mb-6 bg-gray-100 rounded-lg
                                shadow-md dark:bg-gray-700 sm:flex-row sm:items-center">
                                <div>
                                <div className="flex items-center p-1 rounded-lg">
                                    <span className="font-semibold">id:</span>
                                    <Badge>{scooter.id}</Badge>
                                </div>

                                <div className="flex items-center p-1 rounded-lg">
                                    <span className="font-semibold">city:</span>
                                    <Badge>{scooter.city}</Badge>
                                </div>

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
                    </>) : (
                    <p>Inga cyklar tillgängliga</p>
                )}
            </div>
  )
};
