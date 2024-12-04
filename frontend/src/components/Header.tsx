import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { RootState } from '../redux/store/store';
import axios from 'axios';
import { API_URL, getHeader } from '../helpers/config';

export default function Header() {

    const {isLoggedIn, token, user, role} = useSelector((state: RootState) =>  state.auth);
    const dispatch = useDispatch();

    const logOutUser = async () => {
        dispatch(setLoggedInOut(false));
        dispatch(setCurrentUser(null));
        dispatch(setToken(''));
        dispatch(setRole('customer'));
        console.log("Header here");
    }

    const getAuthStatus = async () => {
        const response = await axios.get(`${API_URL}/auth/status`, getHeader(token));
        console.log(response);
    }

    const getAuthMe = async () => {
        const response = await axios.get(`${API_URL}/auth/me`, getHeader(token));
        console.log(response);
    }   

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <p className="font-normal text-gray-700 dark:text-gray-400">Logged In: <b>{isLoggedIn.toString()}</b></p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Token: <b>{token ? token : "Empty"}</b></p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Role: <b>{role}</b></p>
                <p className="font-normal text-gray-700 dark:text-gray-400">User: <b>{user  ? user : "No User"}</b></p>

                <button type="button" className="focus:outline-none text-white bg-red-700 
                focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                dark:focus:ring-red-900" onClick={logOutUser}>Logout</button>

                <button type="button" className="focus:outline-none text-white bg-red-700 
                focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                dark:focus:ring-red-900" onClick={getAuthStatus}>Prompt auth/status</button>
                <button type="button" className="focus:outline-none text-white bg-red-700 
                focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                dark:focus:ring-red-900" onClick={getAuthMe}>Prompt auth/me</button>
            </div>
        </div>
  )
};
