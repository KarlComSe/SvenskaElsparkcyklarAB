import { useDispatch } from 'react-redux';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { useNavigate } from "react-router-dom";
import { Button } from 'flowbite-react';

export default function Logout(props: any) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logOutUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch(setLoggedInOut(false));
        dispatch(setCurrentUser(null));
        dispatch(setToken(''));
        dispatch(setRole('customer'));
        navigate('/')
        console.log("Header here");
    }
  return (
    <Button {...props} data-testid="logoutbutton" color="failure" onClick={(e) => logOutUser(e)}>Logga ut</Button>
  )
}
