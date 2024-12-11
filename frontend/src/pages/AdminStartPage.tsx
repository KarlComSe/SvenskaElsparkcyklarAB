import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { Link } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import scooterImage from '../assets/images/scooter.jpg';
import userImage from '../assets/images/user.jpg';
import { useNavigate } from 'react-router-dom';

const AdminStartPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { role } = useSelector((state: RootState) =>  state.auth);
  const { isLoggedIn } = useSelector((state: RootState) =>  state.auth);
  const navigate = useNavigate();

  const handleUserListPage = () => {
    navigate('/userlistpage')
  }

  return (
<div className='flex justify-between'>
    <div className="w-full max-w-lg p-4 mx-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={scooterImage} alt="Bonnie image"/>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white"> Se överblick av alla elsparkcyklar</h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">kartor</span>
            <div className="flex mt-4 md:mt-6">
                <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Se nu</a>
                <a href="#" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">?</a>
            </div>
        </div>
    </div>

    <div className="w-full max-w-lg p-4 mx-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-10">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={userImage} alt="Bonnie image"/>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Kund information</h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">Se över alla kunders information som saldo, historik med mera</span>
            <div className="flex mt-4 md:mt-6">
                <button>
                <a href="#" onClick={handleUserListPage} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Se över</a>
                </button>
                <a href="#" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Logga ut</a>
            </div>
        </div>
    </div>
</div>

  );
};

export default AdminStartPage;