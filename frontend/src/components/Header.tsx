import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

import { Link } from 'react-router-dom';
import logo from '../assets/images/Logo.webp';
import { Navbar } from "flowbite-react";
import Logout from './Logout';
import Login from './Login';

export default function Header() {

    const {isLoggedIn, role} = useSelector((state: RootState) =>  state.auth);

    return (
        <Navbar className="bg-purple-100 max-w-4xl px-2 py-2.5 sm:px-4 rounded mx-auto md:mb-10 md:pb-5 md:pt-5" data-testid="header" fluid rounded>
        
        <Navbar.Brand as={Link} to="/">
                <img src={logo} className="h-8" alt="Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap">Svenska Elsparkcyklar AB</span>
            </Navbar.Brand>
            <Navbar.Toggle />

        <Navbar.Collapse>
            <Navbar.Link as={Link} to="/">
            Home
            </Navbar.Link>
            { role =="admin" && <Navbar.Link as={Link} to="/adminstartpage">Adminsida</Navbar.Link>}
            { isLoggedIn && 
                <>
                    <Navbar.Link as={Link} to="/customerstartpage">Kundsida</Navbar.Link>
                    <Logout className="p-0" size="xs"></Logout>
                </>
            }
            {
                !isLoggedIn &&
                <Login className="p-0" size="xs"/>
            }
            </Navbar.Collapse>
        </Navbar>
      )
};
