import  { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import axios, { AxiosError } from 'axios';
import { API_URL, getHeader } from '../helpers/config';
import { useNavigate } from "react-router-dom";
import {  toast } from 'react-toastify';

export default function UserGate() {
    const {isLoggedIn, token, user } = useSelector((state: RootState) =>  state.auth);
    const navigate = useNavigate();

    const [myAuthorizations, setMyAuthorizations] = useState<string[]>([])

    useEffect(() => {
        const getMyAuthorizations = async () => {
            if (isLoggedIn) {
                    try {
                        const response = await axios.get(`${API_URL}/auth/me`, getHeader(token));
                        setMyAuthorizations(response.data.roles);
                    } catch (error) {
                        const axiosError = error as AxiosError;
                        toast.error(axiosError.message);
                        setMyAuthorizations(['NotLoggedIn']);
                    }
                }  else {
                    setMyAuthorizations(['NotLoggedIn']);
                }
            }
       

        getMyAuthorizations();
    },[user, isLoggedIn, token])

    useEffect(() => {
        if (myAuthorizations.length < 1) 
            return;

        if ( !myAuthorizations.some(role => ["admin", "user"].includes(role))) {
            toast.error("This page requires you to be logged in, sending you back to homepage");
            navigate("/");
        } 
   
    }, [myAuthorizations, navigate]);
  return null;
}
