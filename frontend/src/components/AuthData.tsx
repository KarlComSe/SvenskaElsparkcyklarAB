import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import axios from 'axios';
import { API_URL, getHeader } from '../helpers/config';
import {  Button, Popover } from "flowbite-react";

export default function AuthData() {

    const {isLoggedIn, token, user, role} = useSelector((state: RootState) =>  state.auth);

    const getAuthStatus = async () => {
        const response = await axios.get(`${API_URL}/auth/status`, getHeader(token));
        console.log(response);
    }

    const getAuthMe = async () => {
        const response = await axios.get(`${API_URL}/auth/me`, getHeader(token));
        console.log(response);
    }   

    return (
        <>

        <div className='w-full grid mb-10 mt-10 text-center 
        bg-red-100 grid-cols-2 text-xs max-w-lg p-2
        mx-6 border border-gray-200 rounded-lg shadow'>
            <div className="my-auto">
                <p className="text-gray-700 m-1">Logged In: <b>{isLoggedIn.toString()}</b></p>
                <p className="text-gray-700 m-1">Role: <b>{role}</b></p>
                <p className="text-gray-700 m-1">User: <b>{user ? JSON.stringify(user) : "No User"}</b></p>
                </div>
                <div>
                <Popover aria-labelledby="default-popover" content={<p>{token ? token : "Empty"} </p>}>
                    <Button color="gray" className="p-0 m-1" size="xs" onClick={() => console.log(token)}>Klicka här för token</Button>
                </Popover>

                <Button color="gray" className="p-0 m-1" size="xs" onClick={getAuthStatus}>Prompt auth/status i console</Button>
                <Button color="gray" className="p-0 m-1" size="xs" onClick={getAuthMe}>Prompt auth/me i console</Button>
                </div>
        </div>
        </>
      )
};
