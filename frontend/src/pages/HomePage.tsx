import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { GITHUB_URL } from '../helpers/config';
import { Link } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';

const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { role } = useSelector((state: RootState) =>  state.auth);
  const { isLoggedIn } = useSelector((state: RootState) =>  state.auth);

  const handleSwitchRole = () => {
      const newRole = role === 'customer' ? 'admin' : 'customer';
      dispatch(setRole(newRole));
  };

  const loginUser = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      window.location.href = GITHUB_URL;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
        { isLoggedIn 
        ?
        (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 dark:text-blue">You are logged in</h5>
          </div>
        )
        :
          (<>
            <h1 className="text-2xl font-bold mb-4 text-green-500">Logga in som {role}</h1>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-blue dark:text-white rounded" onClick={(e) => loginUser(e)}>
            Logga in
            </button>
            <button onClick={handleSwitchRole} className="mt-4 text-sm text-blue-500">
            Växla till {role === 'customer' ? 'admin' : 'kund'}
            </button>
          </>
          )
      }
    </div>
  );
};

export default HomePage;