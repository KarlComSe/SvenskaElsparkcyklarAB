import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { Link } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';

const UserListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { role } = useSelector((state: RootState) =>  state.auth);
  const { isLoggedIn } = useSelector((state: RootState) =>  state.auth);

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