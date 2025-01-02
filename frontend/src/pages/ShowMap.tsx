import Map from '../components/Map';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { API_URL} from '../helpers/config';
import { useEffect, useState } from 'react';
import { Scooter } from '../helpers/map/leaflet-types'

export default function ShowMap() {
  const { city }  = useParams();
      const [scooterData, setScooterData] = useState<Scooter[]>([]);
  
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

  return (
    <>
      <div data-testid="show-map"><Map city={city ?? "Göteborg"}/></div>
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
  </>
  )
};
