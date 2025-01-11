import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_URL, getHeader } from '../helpers/config';
import { toast } from 'react-toastify';
import { toastOptionsError } from '../helpers/config';


export type City = {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    createdAt: string;
    updatedAt: string; 
};
  
export type BikeStatus = {
    batteryLevel: number;
    city: City;
    createdAt: string;
    id: string;
    latitude: number;
    longitude: number;
    status: "Rented" | "Available" | "Service" | string; // Add other possible status values if needed
    updatedAt: string; // ISO timestamp as a string
};

export type Scooter = {
    id: string;
    batteryLevel: number;
    latitude: number;
    longitude: number;
    status: string;
    city: string;
    createdAt: string;
    updatedAt: string;
  };

export type Rental = {
        
          id: number | string,
          startTime: string,
          latStart: number,
          longStart: number,
          startZoneType: string,
          endZoneType: string,
          cost: number
          stopTime?: string,
}

export const bikePerCity = async (city: string, token: string, status = '') : Promise<BikeStatus[]> =>
{
    let data;
    
    try {
            const response = await axios.get(`${API_URL}/bike/city/${city}`, getHeader(token));
            if (status === '')
            {
                data = response;
            } else {
                data = response.data.filter((item : BikeStatus) => item.status === status);
            }
    }
    catch(error) {
        const err = error as AxiosError<{message: string}>;
        toast.error(err?.response?.data.message, toastOptionsError)

    }
    console.log(data);
    return data;
}

  
export const allBikes = async ( token:string ) : Promise<Scooter[]> =>
{
        let data;
        try {
                const response = await axios.get(`${API_URL}/bike`, getHeader(token));
                data = response.data;
        }
        catch(error) {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data?.message, toastOptionsError)

        }
        return data;
}

export const rentBike = async (bikeId: string, token: string) : Promise<AxiosResponse> =>
{
        let data: AxiosResponse["data"];
        try
        {
            const response = await axios.post(`${API_URL}/rental/bike/${bikeId}`, {}, getHeader(token));

            data = {... response.data, "statusCode": 200 };

                
        }
        catch(error) {
            const err = error as AxiosError<{message: string}>;
            toast.error(err?.response?.data.message, toastOptionsError)
            data = err?.response?.data;
        }
        return data;
}

export const returnBike = async (tripID: string | number | null, token: string) : Promise<AxiosResponse["data"]> =>
{
        let data: AxiosResponse["data"];


            try {
                    const response = await axios.post(`${API_URL}/rental/${tripID}/end`, {}, getHeader(token));
                    data = {... response.data, "statusCode": 200 };
            }
            catch(error) {

                const err = error as AxiosError<{message: string}>;
                toast.error(err?.response?.data.message, toastOptionsError)
                data = err?.response?.data;
            }
            return data;
}


export const allRentals = async (token: string): Promise<Rental[]> => {
    let data = [];
    try {
        const me = await axios.get(`${API_URL}/auth/me`, getHeader(token));
        const userId = me.data.githubId;
        const response = await axios.get(`${API_URL}/rental/customer/${userId}`, getHeader(token));
        data = response.data;
        console.log(data)
    } catch(error)
    {
        console.log(`No rentals found for user`);
        if (error instanceof AxiosError && error.response?.data?.message) {
            console.log(`Rentals error: ${error.response.data.message}`);
        }
    }
    return data;
}


export const bikeIdByFive = async (bikeIdFive: string, token: string): Promise<string | undefined> => {
    const data = await allBikes(token);
    const bike = data.find((item: Scooter) => item.id.startsWith(bikeIdFive.toLowerCase()));

    return bike?.id;
}

export const returnAllRentals = async (token: string): Promise<AxiosResponse | undefined> => {
    let data;
    try {
        const me = await axios.get(`${API_URL}/auth/me`, getHeader(token));
        const userId = me.data.githubId;
        data = await axios.post(`${API_URL}/rental/${userId}/end-all-travels`,{}, getHeader(token));
        
    } catch(error)
    {  
        if (error instanceof AxiosError && error.response?.data?.message) {
            toast.error(`Rentals were not returned: ${error.response.data.message}`, toastOptionsError);
        }
    }
    return data
}

export function formatTimestamp(isoString: string) {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
