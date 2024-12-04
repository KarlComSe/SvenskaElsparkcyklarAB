import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';

import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from '../helpers/config';
import axios from 'axios';

const Github: React.FC = () => {

    const [ searchParams, setsearchParams] = useSearchParams();
    const [ loading, setLoading] = useState(true);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const attemptedRef = useRef(false);  // Track if we've attempted auth

    useEffect(() => {

        if (isLoggedIn) {
            navigate('/');
            return;
        }

        const code = searchParams.get('code');
        if (!code || attemptedRef.current) return;  // Skip if no code or already attempted

        const backendAuth = async() => {
            setLoading(true);
        try {
                attemptedRef.current = true;  // Mark as attempted
                const codeObject = Object.fromEntries(searchParams);
                const response = await axios.post(`${API_URL}/auth/token`, codeObject);
                console.log(response);
                dispatch(setToken(response.data.access_token));
                setisLoggedIn(true);
            }
            catch(error)
            {
                console.log(error);
            }
    }
        backendAuth();

    }, [searchParams, isLoggedIn]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
            <Spinner spinnerColor='red'/>
            Setting credentials 
            {searchParams.get('searchParams')}
        </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Spinner spinnerColor='red'/>
            Setting credentials 
            {searchParams.get('searchParams')}
        </div>
    );
};

export default Github;
