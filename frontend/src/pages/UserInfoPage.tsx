import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { Link } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import userImage from '../assets/images/user.jpg';
import axios from 'axios';
import { API_URL, getHeader } from '../helpers/config';

const UserInfoPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isLoggedIn, token, user, role } = useSelector((state: RootState) => state.auth);
    const [userData, setUserData] = useState<any>(null);

const getAuthMe = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, getHeader(token));
        console.log(response.data);
        setUserData(response.data);
    } catch (error) {
        console.error('Error fetching user data', error);
    }
    };

useEffect(() => {
    if (isLoggedIn) {
    getAuthMe();
    }
}, [isLoggedIn, token]);

return (
    <div className="flex justify-center items-center min-h-screen">
        <div className="block h-fit w-96 overflow-scroll p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-contain" src={userImage} alt="User image" />
            
            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Användare: <b>{userData?.username || "No User"}</b>
            </p>

            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Email: <b>{userData?.email|| "No Email"}</b>
            </p>

            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Skapat: <b>{userData?.createdAt || "No User"}</b>
            </p>
            
            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Roll: <b>{role}</b>
            </p>
            
            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Github Id: <b>{userData?.githubId || ":("}</b>
            </p>
            
            <p>
                <Link to="/customerstartpage" className="py-2 m-16 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Gå tillbaka
                </Link>
            </p>
        </div>
    </div>
);
};

export default UserInfoPage;
