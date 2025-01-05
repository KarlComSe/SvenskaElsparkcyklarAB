
import { useEffect, useState } from 'react';

import { API_URL, getHeader} from '../../helpers/config';
import axios from 'axios';
import { Scooter,  Zone } from '../../helpers/map/leaflet-types'
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import AdminGate from '../../components/AdminGate';


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
            <div data-testid="all-scooter-list" className="mt-4 bg-gray-600 rounded">
                <AdminGate/>
                <h2 className="text-xl font-bold mb-2">Alla cyklar</h2>
                {scooterData.length > 0 ? (
                    <div>
                    <h2>Antal cyklar: {scooterData.length} </h2>
                    <ul className="list-disc pl-6 list-none">
                        {scooterData.map((scooter) => (
                            <li key={scooter.id} className="mb-2">
                                <div className="mt-4 p-6 mx-auto w-1/2 hover:opacity-5 bg-gray-400 rounded text-center">
                                <h2><span className="font-semibold">ID:</span> {scooter.id} -{" "}</h2>
                                <span className="font-semibold">City:</span> {scooter.city} -{" "}
                                <span className="font-semibold">createdAt:</span> {scooter.createdAt} -{" "}
                                <span className="font-semibold">updatedAt:</span> {scooter.updatedAt} -{" "}
                                <span className="font-semibold">Batteri:</span> {scooter.batteryLevel}% -{" "}
                                <span className="font-semibold">Status:</span> {scooter.status} -{" "}
                                <span className="font-semibold">Longitud:</span> {scooter.longitude} -{" "}
                                <span className="font-semibold">Latitud:</span> {scooter.latitude}
                                </div>
                            </li>
                        ))}
                        </ul>
                    </div>) : (
                    <p>Inga cyklar tillgängliga</p>
                )}
            </div>
  )
};
