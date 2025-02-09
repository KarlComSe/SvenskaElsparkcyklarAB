import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../components/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_URL } from '../helpers/config';
import axios from 'axios';
import { toast } from 'react-toastify';


const Github: React.FC = () => {

    const [ searchParams ] = useSearchParams();
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const attemptedRef = useRef(false);  // Track if we've attempted auth

    const userRole = useSelector((state: RootState) => state.auth.role);

    useEffect(() => {

        if (isLoggedIn) {
            if (userRole === 'admin') {
                navigate('/adminstartpage');
            } else if (userRole === 'user') {
                navigate('/customerstartpage');
            } else if (userRole) {
                console.error('Unexpected role:', userRole);
            }
            return;
        }

        const code = searchParams.get('code');
        if (!code || attemptedRef.current) return;  // Skip if no code or already attempted

        const backendAuth = async() => {
            try {
                    attemptedRef.current = true;  // Mark as attempted
                    const codeObject = Object.fromEntries(searchParams);
                    const response = await axios.post(`${API_URL}/auth/token`, codeObject);
                    console.log(response);
                    dispatch(setToken(response.data.access_token));
                    dispatch(setCurrentUser(response.data.user.username));
                    dispatch(setLoggedInOut(true));
                    setisLoggedIn(true);
                    if (response.data.user.roles.includes("admin")) {
                        console.log("admin")
                        dispatch(setRole("admin"));
                    } else {
                        dispatch(setRole("user"));
                    }
                }
                
            catch(error)
            {
                toast.error("There was an error, contact the admin");
                console.log(error);
                navigate('/');
            }
            
        }
        backendAuth();

    }, [searchParams, isLoggedIn, userRole, dispatch, navigate]); 

    return (
        <div className="flex flex-col items-center justify-center h-screen" data-testid="github-test">
            <Spinner spinnerColor='red'/>
            Setting credentials 
            {searchParams.get('searchParams')}
        </div>
    );
};

export default Github;
