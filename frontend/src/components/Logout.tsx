import { useDispatch } from 'react-redux';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import { useNavigate } from "react-router-dom";

export default function Logout() {

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
    <button data-testid="logoutbutton" type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-200 focus:ring-4
focus:outline-none focus:ring-red-300 dark:bg-red-400 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={(e) => logOutUser(e)}>Logga ut</button>
  )
}
