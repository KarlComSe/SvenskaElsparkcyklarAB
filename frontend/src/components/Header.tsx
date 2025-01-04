import { useSelector } from 'react-redux';

import { RootState } from '../redux/store/store';
import axios from 'axios';
import { API_URL, getHeader } from '../helpers/config';

import { Link } from 'react-router-dom';
import logo from '../assets/images/scooters.webp';
import { Navbar, Button, Clipboard } from "flowbite-react";
import Logout from './Logout';
import Login from './Login';

export default function Header() {

    const {isLoggedIn, token, user, role} = useSelector((state: RootState) =>  state.auth);


    const getAuthStatus = async () => {
        const response = await axios.get(`${API_URL}/auth/status`, getHeader(token));
        console.log(response);
    }

    const getAuthMe = async () => {
        const response = await axios.get(`${API_URL}/auth/me`, getHeader(token));
        console.log(response);
    }   

    return (
        <>
    <Navbar fluid rounded>
      
       <Navbar.Brand as={Link} to="/">
            <img src={logo} className="h-8" alt="Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Hemåt</span>
        </Navbar.Brand>

      <Navbar.Collapse>
        <Navbar.Link as={Link} to="/">
        Home
        </Navbar.Link>
        { role =="admin" && <Navbar.Link as={Link} to="/adminstartpage">Adminsida</Navbar.Link>}
        { isLoggedIn && 
            <>
                <Navbar.Link as={Link} to="/customerstartpage">Kundsida</Navbar.Link>
                <Logout className="px-1 py-0.5" size="xs"></Logout>
            </>
        }
        {
            !isLoggedIn &&
            <Login className="px-1 py-0.5" size="xs"/>
        }
        </Navbar.Collapse>
    </Navbar>

        <div className='flex justify-center items-center'>
            <div className="text-xs block max-w-sm p-6 h-40 overflow-scroll bg-white border border-gray-200 rounded-lg shadow">

                <p className="text-gray-700 dark:text-gray-400">Logged In: <b>{isLoggedIn.toString()}</b></p>
                {/* <p className="text-gray-700 dark:text-gray-400 overflow-scroll">Token: <b className="overflow-scroll  w-40 block">{token ? token : "Empty"}</b></p> */}
                <Clipboard className="text-xs" onClick={() => console.log(token)} valueToCopy={token ? token : "Empty"} label="Kopiera token genom att klicka här, visas även i console" />

                
                <p className="text-gray-700 dark:text-gray-400">Role: <b>{role}</b></p>
                <p className="text-gray-700 dark:text-gray-400">User: <b>{user  ? JSON.stringify(user) : "No User"}</b></p>

                <Button color="warning" size="xs" onClick={getAuthStatus}>Prompt auth/status in console</Button>
                <Button color="warning" size="xs" onClick={getAuthMe}>Prompt auth/me in console</Button>
            </div>
        </div>
        
        </>
      )
};
