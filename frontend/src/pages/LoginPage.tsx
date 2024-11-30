import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRole } from '../redux/authLogin';
import { RootState, AppDispatch } from '../redux/store';

const LoginPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const role = useSelector((state: RootState) => state.auth.role);

    const handleSwitchRole = () => {
        const newRole = role === 'customer' ? 'admin' : 'customer';
        dispatch(setRole(newRole));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4 text-green-500">Logga in som {role}</h1>
        <form 
        // onSubmit={handleSubmit}
        className="space-y-4 text-gray-500">
            <input
            type="text"
            placeholder="Användarnamn"
            className="border p-2 rounded w-full"
            />
            <input
            type="password"
            placeholder="Lösenord"
            className="border p-2 rounded w-full"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Logga in
            </button>
        </form>
        <button onClick={handleSwitchRole} className="mt-4 text-sm text-blue-500">
            Växla till {role === 'customer' ? 'admin' : 'kund'}
        </button>
        </div>
    );
};

export default LoginPage;
