
import { useEffect, useState } from 'react';

import { API_URL, getHeader} from '../../helpers/config';
import axios from 'axios';
import { Scooter } from '../../helpers/map/leaflet-types'
import { RootState } from '../../redux/store/store';
import { useSelector } from 'react-redux';
import AdminGate from '../../components/AdminGate';
import { Badge } from 'flowbite-react';
import BikeList from '../../components/BikeList';


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
                        <BikeList scooterData={scooterData} isCityList={true}/>
                    </>) : (
                        <div className="mx-auto mb-5">
                            <p>Inga cyklar tillgängliga</p>
                        </div>
                )}
            </div>
  )
};
