import Map from '../../components/Map';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { API_URL} from '../../helpers/config';
import { useEffect, useState, useRef } from 'react';
import { Scooter,  Zone } from '../../helpers/map/leaflet-types'
import { Label, ToggleSwitch } from 'flowbite-react';
import AdminGate from '../../components/AdminGate';
import { Badge } from 'flowbite-react';

export default function ShowMap() {
    const { city }  = useParams();
    const [zoneData, setZoneData] = useState<Zone[]>([]);
    const [scooterData, setScooterData] = useState<Scooter[]>([]);
    const [realTime, setRealTime] = useState(false);
    const timerRef = useRef<null | number>(null);
    const [trigger, setTrigger] = useState(0);
  
    const updateRealTime = () => {
      setRealTime(!realTime);
      if (realTime)
      {
        stopTimer();
      } else {
        startTimer();
      }
      
    }

    const startTimer = () => {
      if (!timerRef.current)
        {
          timerRef.current = setInterval(() => {
            setTrigger((prev) => prev + 1);
          }, 1000);
        }
  };

  const stopTimer = () => {
      if (timerRef.current)
        {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
  };
    
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
    },[city, trigger])

    useEffect(() => {
      const fetchZones = async() => {
      try {

              const response = await axios.get(`${API_URL}/zone/city/${city}`);
              setZoneData(response.data);
          }
          catch(error)
          {
          }
    }
    fetchZones();
    },[city, trigger])


  return (
    <>
    <AdminGate/>
      <div data-testid="show-map"><Map city={city ?? "Göteborg"} zoneData={zoneData} scooterData={scooterData}/></div>
      <div className="flex flex-col items-center justify-center my-2 py-2 bg-red-300 rounded-md w-full sm:max-w-xl mx-auto">
      <Label htmlFor="realtimetoggle">Vill du uppdatera kartan i realtid?</Label>
      <ToggleSwitch id="realtimetoggle" checked={realTime} onChange={updateRealTime}>Uppdatera i realtid?</ToggleSwitch>
      </div>
        <div id="scooter-list" className="p-4 flex flex-col justify-center w-full">
          <div className="mx-auto">
          <h2 className="text-4xl font-bold text-gray-900"> Cyklar i {city}: </h2>
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
  </>
  )
};
