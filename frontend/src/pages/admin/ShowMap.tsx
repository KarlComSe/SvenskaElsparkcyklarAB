import Map from '../../components/Map';
import { useParams } from "react-router-dom";
import axios, { AxiosError } from 'axios';
import { API_URL} from '../../helpers/config';
import { useEffect, useState, useRef } from 'react';
import { Zone } from '../../helpers/map/leaflet-types'
import { Scooter } from '../../helpers/bike-functions';
import AdminGate from '../../components/AdminGate';

import BikeList from '../../components/BikeList';
import RealTimeUpdate from '../../components/RealTimeUpdate';
import RealTimeContext from '../../helpers/RealTimeContext';

export default function ShowMap() {
    const { city }  = useParams();
    const [zoneData, setZoneData] = useState<Zone[]>([]);
    const [scooterData, setScooterData] = useState<Scooter[]>([]);
    const [realTime, setRealTime] = useState(false);
    const [isLowRes, setIsLowRes] = useState(false);
    const [trigger, setTrigger] = useState(0);
    const timerRef = useRef<null | number>(null);


    useEffect(() => {
      const fetchScooters = async() => {
      try {
              const response = await axios.get(`${API_URL}/bike/city/${city}`);
              setScooterData(response.data);
          }
          catch(error)
          {
            const axiosError = error as AxiosError;
            console.log(axiosError?.response?.data);
          }
    }
    fetchScooters();
    },[city, trigger])

    useEffect(() => {
      const fetchZones = async () => {
      try {

              const response = await axios.get(`${API_URL}/zone/city/${city}`);
              setZoneData(response.data);
          }
          catch(error)
          {
            const axiosError = error as AxiosError;
            console.log(axiosError?.response?.data);
          }
    }
    fetchZones();
    },[city]);
  

  return (
    <RealTimeContext.Provider value={{realTime, setRealTime, isLowRes, setIsLowRes}}>
      <AdminGate/>
        <div data-testid="show-map" className="mx-auto sm:max-w-4xl"><Map city={city ?? "Göteborg"} zoneData={zoneData} scooterData={scooterData}/></div>

        <RealTimeUpdate timerRef={timerRef} setTrigger={setTrigger}/>

          <div id="scooter-list" className="p-4 flex flex-col justify-center w-full">
            <div className="mx-auto">
            <h2 className="text-4xl font-bold text-gray-900"> Cyklar i {city}: </h2>
          </div>
        {scooterData.length > 0 ? (
          <>
          <div className="mx-auto mb-5">
          <h2>Antal cyklar: <b>{scooterData.length}</b> </h2>
          </div>
          <BikeList scooterData={scooterData} isCityList={false} isLowRes={realTime}/>
          </>) : (
                  <div className="mx-auto mb-5">
                      <p>Inga cyklar tillgängliga</p>
                  </div>
      )}
      </div>
  </RealTimeContext.Provider>
  )
};
