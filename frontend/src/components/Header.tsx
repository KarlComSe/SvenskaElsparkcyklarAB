import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { RootState } from '../redux/store/store';
import axios from 'axios';
import { API_URL, getHeader } from '../helpers/config';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from '../assets/images/scooters.webp';


export default function Header() {

    const {isLoggedIn, token, user, role} = useSelector((state: RootState) =>  state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logOutUser = async () => {
        dispatch(setLoggedInOut(false));
        dispatch(setCurrentUser(null));
        dispatch(setToken(''));
        dispatch(setRole('customer'));
        navigate('/')
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
        <>


        <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <img src={logo} className="h-8" alt="Flowbite Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Hemåt</span>
            </Link>
            <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                    <Link to="/adminmapnavigation" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Karta</Link>
                </li>
                <li>
                    <Link to="/adminstartpage" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Admin Start Page</Link>
                </li>
                <li>
                    <Link to="/customerstartpage" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Customer Start Page</Link>
                </li>
                <li>
                    <Link to="/userlistpage" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">User List Page</Link>
                </li>
                <li>
                    <Link to="/userinfopage" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500
                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">User Info Page</Link>
                </li>

            </ul>
            </div>
        </div>
        </nav>


        <div className='flex justify-center items-center min-h-screen'>
            <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 overflow-hidden	">

                <p className="font-normal text-gray-700 dark:text-gray-400">Logged In: <b>{isLoggedIn.toString()}</b></p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Token: <b>{token ? token : "Empty"}</b></p>
                <p className="font-normal text-gray-700 dark:text-gray-400">Role: <b>{role}</b></p>
                <p className="font-normal text-gray-700 dark:text-gray-400">User: <b>{user  ? JSON.stringify(user) : "No User"}</b></p>

                <button type="button" className="focus:outline-none text-white bg-red-700 
                focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                dark:focus:ring-red-900" onClick={logOutUser}>Logout</button>

                <button type="button" className="focus:outline-none text-white bg-red-700 
                focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                dark:focus:ring-red-900" onClick={getAuthStatus}>Prompt auth/status in console</button>
                <button type="button" className="focus:outline-none text-white bg-red-700 
                focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5
                py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700
                dark:focus:ring-red-900" onClick={getAuthMe}>Prompt auth/me in console</button>
            </div>
        </div>
        </>
  )
};
