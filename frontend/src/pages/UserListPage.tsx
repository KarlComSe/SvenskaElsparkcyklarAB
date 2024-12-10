import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { Link } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { API_URL, getHeader } from '../helpers/config';
import axios from 'axios';

const UserListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { role, isLoggedIn, token, user } = useSelector((state: RootState) =>  state.auth);

  useEffect(() => {
    const usersFromBackend = async() => {
        try {
                const response = await axios.get(`${API_URL}/users`, getHeader(token));
                console.log(response.data);
            }
            
        catch(error)
        {

        }
        
    }
    usersFromBackend();

}, []); 



  return (
    <div className="w-full max-w-lg p-4 mx-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
                <form action="" className="text-black">
                    <p className='font-normal text-gray-700 dark:text-gray-400'>"hej"</p>
                    <h1 className="font-normal text-gray-700 dark:text-gray-400">vad händer</h1>
                </form>
            </div>
        </div>
  );
};

export default UserListPage;