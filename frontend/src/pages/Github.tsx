import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';

import { useSearchParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from '../helpers/config';
import axios from 'axios';

const Github: React.FC = () => {

    const [ code, setCode] = useSearchParams();
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        // if(isLoggedIn) navigate('/login');
        const backendAuth = async() => {
            setLoading(true);
        try {

                const response = await axios.post(`${BACKEND_URL}/auth/token`, code);
                console.log(response);
            }
            catch(error)
            {
                console.log(error);

            }
    }
    backendAuth();
    }, []);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
            <Spinner spinnerColor='red'/>
            Setting credentials 
            {code.get('code')}
        </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Spinner spinnerColor='red'/>
            Setting credentials 
            {code.get('code')}
        </div>
    );
};

export default Github;
