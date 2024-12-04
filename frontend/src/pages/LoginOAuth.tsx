import React, {useState} from 'react';
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { GITHUB_URL } from '../helpers/config';


const LoginOAuth: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { role } = useSelector((state: RootState) =>  state.auth);
    const [userMail, setUserMail] = useState("none");

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
                <h1 className="text-2xl font-bold mb-4 text-green-500">Logga in som {role}</h1>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" onClick={(e) => loginUser(e)}>
            Logga in
            </button>
        {/* </form> */}
        <button onClick={handleSwitchRole} className="mt-4 text-sm text-blue-500">
            Växla till {role === 'customer' ? 'admin' : 'kund'}
        </button>
        </div>
    );
};

export default LoginOAuth;
