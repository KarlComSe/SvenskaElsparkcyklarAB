import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { Link } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';

const UserInfoPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {isLoggedIn, token, user, role} = useSelector((state: RootState) =>  state.auth);

  return (
//     <div className='flex justify-center items-center min-h-screen'>
//     <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
//         <p className="font-normal text-gray-700 dark:text-gray-400 break-words overflow-x-hidden">Logged In: <b>{isLoggedIn.toString()}</b></p>
//         <p className="font-normal text-gray-700 dark:text-gray-400">Token: <b>{token ? token : "Empty"}</b></p>
//         <p className="font-normal text-gray-700 dark:text-gray-400">Role: <b>{role}</b></p>
//         <p className="font-normal text-gray-700 dark:text-gray-400">User: <b>{user  ? user : "No User"}</b></p>
//     </div>
// </div>

    <div className='flex justify-center items-center min-h-screen'> 
        <div className="block h-auto max-h-screen overflow-scroll p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <p className="font-normal text-gray-700 dark:text-gray-400 ">
                Logged In: <b>{isLoggedIn.toString()}</b>
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400 overflow-hidden break-words">
                Token: <b>{token ? token : "Empty"}</b>
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400 overflow-hidden break-words">
                Role: <b>{role}</b>
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400 overflow-hidden break-words">
                User: <b>{user ? user : "No User"}</b>
            </p>
        </div>
    </div>
  );
};

export default UserInfoPage;