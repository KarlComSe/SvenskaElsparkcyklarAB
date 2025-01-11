
import { useState } from 'react';

import { API_URL } from '../../helpers/config';
import axios from 'axios';
import { Zone } from '../../helpers/map/leaflet-types'
import { Scooter } from '../../helpers/bike-functions';
import { Label, Select, Button } from "flowbite-react";
import Map from '../../components/Map';
import ZoneTables from '../../components/ZoneTables';
import AdminGate from '../../components/AdminGate';

export default function AllZones() {
    const [city, setCity] = useState("Välj stad");
    const [zoneDataParking, setZoneDataParking] = useState<Zone[]>();
    const [zoneDataLoading, setZoneDataLoading] = useState<Zone[]>();
    const [zoneDataTotal, setZoneDataTotal] = useState<Zone[]>();
    const [bikeTotal, setBikeTotal] = useState<Scooter[]>();
    const [stadTitel, setStadTitel] = useState("");

    const changeCity = (e: React.ChangeEvent<HTMLSelectElement>)=> {
        const selectedCity = e.target.value as "Göteborg" | "Jönköping" | "Karlshamn";

            setCity(selectedCity);
    }

    const loadZoneData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try
        {
            const responseParking = await axios.get(`${API_URL}/zone?type=parking&includes=bikes&city=${city}`);
            const responseLoading = await axios.get(`${API_URL}/zone?type=charging&includes=bikes&city=${city}`);
            setZoneDataLoading(responseLoading.data.zones);
            setZoneDataParking(responseParking.data.zones);
            const totalZones = responseLoading.data?.zones?.concat(responseParking.data?.zones);
            setZoneDataTotal(totalZones);
            let bikes: Scooter[] = [];
            totalZones.map((zone: Zone) => {
                if (zone.bikes) {
                    bikes = bikes.concat(zone.bikes); // Lägg till bikes om de finns
                }
            });
            setBikeTotal(bikes);
            setStadTitel(city);

        } catch (error)
        {
            console.log(error);
        }

    }

    return (
            <div data-testid="allzones">
                <AdminGate/>
                <div className="flex justify-center items-center space-x-4">
                    <div className="mb-2 block">
                        <Label htmlFor="stad" value="Välj stad" />
                    </div>
                    <div className="mb-2 block">
                        <Select id="stad" value={city} onChange={(e) => changeCity(e)} required>
                        {city === "Välj stad" && <option value="Välj stad">Välj stad</option>}
                        <option>Göteborg</option>
                        <option>Jönköping</option>
                        <option>Karlshamn</option>
                        </Select>
                    </div>

                    <div className="mb-2 block">
                        <Button disabled={city === "Välj stad"} onClick={(e) => loadZoneData(e)}>
                        Tryck för att ladda zoner/cyklar
                        </Button>
                    </div>
                </div>
                <Map city={city} zoneData={zoneDataTotal ?? []} scooterData={bikeTotal ?? []}/>
                <div className="w-full text-center my-4">
                    <h1 className="text-3xl font-bold">Parkeringszoner i {stadTitel}</h1>
                    <ZoneTables zoneData={zoneDataParking}/>
                </div>
                <div className="w-full text-center my-4">
                    <h1 className="text-3xl font-bold">Laddzoner i {stadTitel}</h1>
                    <ZoneTables zoneData={zoneDataLoading}/>
                </div>


            </div>
    );
};
