import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';


const LoginPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { role } = useSelector((state: RootState) =>  state.auth);
    const [userMail, setUserMail] = useState("none");

    const handleSwitchRole = () => {
        const newRole = role === 'customer' ? 'admin' : 'customer';
        dispatch(setRole(newRole));
    };

    const loginUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        //SKA ÄNDRAS SEN NÄR VI FÅR IGÅNG BACKEND
        console.log("Login here");
        dispatch(setLoggedInOut(true));
        dispatch(setCurrentUser(userMail));
        dispatch(setToken(`${new Date().toISOString()}`));
    };

    // const loginUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    //     e.preventDefault();

    //     // GitHub OAuth URL with your client ID
    //     const githubAuthUrl = 'https://github.com/login/oauth/authorize';
    //     const clientId = 'Ov23liY1kaJ2acYLtBhq';
    //     const redirectUri = 'http://localhost:5173/github/callback';
    //     const scope = 'user:email';

    //     const url = `${githubAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

    //     // Redirect to GitHub
    //     window.location.href = url;
    // };

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
            onChange={(e) => setUserMail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Lösenord"
            className="border p-2 rounded w-full"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" onClick={(e) => loginUser(e)}>
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
