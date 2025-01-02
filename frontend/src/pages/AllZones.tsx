
import { useEffect, useState } from 'react';

import { API_URL, getHeader} from '../helpers/config';
import axios from 'axios';
import { Zone } from '../helpers/map/leaflet-types'
import { RootState } from '../redux/store/store';
import { useSelector } from 'react-redux';
import { Label, Select, Button, Table, Badge } from "flowbite-react";
import Map from '../components/Map';

export default function AllZones() {
    const [city, setCity] = useState("Välj stad");
    const [zoneDataParking, setZoneDataParking] = useState<Zone[]>()
    const [zoneDataLoading, setZoneDataLoading] = useState<Zone[]>()

    const changeCity = (e: React.ChangeEvent<HTMLSelectElement>)=> {
        const selectedCity = e.target.value as "Göteborg" | "Jönköping" | "Karlshamn";
        if (selectedCity === "Göteborg" || selectedCity === "Jönköping" || selectedCity === "Karlshamn") {
            setCity(selectedCity);
        }
    }

    const loadZoneData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try
        {
            const responseParking = await axios.get(`${API_URL}/zone?type=parking&includes=bikes&city=${city}`);
            const responseLoading = await axios.get(`${API_URL}/zone?type=charging&includes=bikes&city=${city}`);
            setZoneDataLoading(responseLoading.data.zones);
            setZoneDataParking(responseParking.data.zones);

        } catch (error)
        {

        }

    }

    return (
            <>
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
                        Tryck för att ladda zoner
                        </Button>
                    </div>
                </div>
                <Map city={city}/>
                <div>
                    <h1>Parkeringszoner</h1>
                    {
                        zoneDataParking?.map((zone: Zone) => (
                            <>

                            <div className="flex flex-wrap items-center gap-4 p-4 mb-4 bg-gray-50 rounded-lg shadow dark:bg-gray-700">
                                <Badge color="info"><span className="font-bold text-xl">Name: {zone.name}</span></Badge>
                                <Badge color="success"><span className="font-bold text-xl">id: {zone.id}</span></Badge>
                                <Badge color="info"><span className="font-bold text-xl">Type: {zone.type}</span></Badge>
                                <Badge color="warning"><span className="font-bold text-xl">Number of bikes: {zone.bikes?.length}</span></Badge>

                            </div>
                            <Table>
                            <Table.Head>
                            <Table.HeadCell>Bike ID</Table.HeadCell>
                            <Table.HeadCell>Bike Battery Level</Table.HeadCell>
                            <Table.HeadCell>Latitude</Table.HeadCell>
                            <Table.HeadCell>Longitude</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Created At</Table.HeadCell>
                            <Table.HeadCell>Updated At</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                            { zone.bikes?.map((bike) => (
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {bike.id}
                                </Table.Cell>
                                <Table.Cell>{bike.batteryLevel}</Table.Cell>
                                <Table.Cell>{bike.latitude}</Table.Cell>
                                <Table.Cell>{bike.longitude}</Table.Cell>
                                <Table.Cell>{bike.status}</Table.Cell>
                                <Table.Cell>{bike.createdAt}</Table.Cell>
                                <Table.Cell>{bike.updatedAt}</Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                            ))}

                            </Table.Body>
                        </Table>
                        </>))
                        }
                </div>
                <div>
                    <h1>Laddzoner</h1>
                    {
                        zoneDataLoading?.map((zone: Zone) => (
                            <>

                            <div className="flex flex-wrap items-center gap-4 p-4 mb-4 bg-gray-50 rounded-lg shadow dark:bg-gray-700">
                                <Badge color="info"><span className="font-bold text-xl">Name: {zone.name}</span></Badge>
                                <Badge color="success"><span className="font-bold text-xl">id: {zone.id}</span></Badge>
                                <Badge color="info"><span className="font-bold text-xl">Type: {zone.type}</span></Badge>
                                <Badge color="warning"><span className="font-bold text-xl">Number of bikes: {zone.bikes?.length}</span></Badge>

                            </div>
                            <Table>
                            <Table.Head>
                            <Table.HeadCell>Bike ID</Table.HeadCell>
                            <Table.HeadCell>Bike Battery Level</Table.HeadCell>
                            <Table.HeadCell>Latitude</Table.HeadCell>
                            <Table.HeadCell>Longitude</Table.HeadCell>
                            <Table.HeadCell>Status</Table.HeadCell>
                            <Table.HeadCell>Created At</Table.HeadCell>
                            <Table.HeadCell>Updated At</Table.HeadCell>
                            <Table.HeadCell>
                                <span className="sr-only">Edit</span>
                            </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                            { zone.bikes?.map((bike) => (
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {bike.id}
                                </Table.Cell>
                                <Table.Cell>{bike.batteryLevel}</Table.Cell>
                                <Table.Cell>{bike.latitude}</Table.Cell>
                                <Table.Cell>{bike.longitude}</Table.Cell>
                                <Table.Cell>{bike.status}</Table.Cell>
                                <Table.Cell>{bike.createdAt}</Table.Cell>
                                <Table.Cell>{bike.updatedAt}</Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>
                            ))}

                            </Table.Body>
                        </Table>
                        </>))
                        }
                </div>



            </>
    );
};
