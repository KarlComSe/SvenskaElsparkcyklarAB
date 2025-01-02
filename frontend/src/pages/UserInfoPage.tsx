import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { Link, Navigate } from 'react-router-dom';
import { setLoggedInOut, setCurrentUser, setToken, setRole } from '../redux/slices/authLogin';
import userImage from '../assets/images/user.jpg';
import axios, {AxiosError} from 'axios';
import { API_URL, getHeader } from '../helpers/config';
import { Button, ToggleSwitch, TextInput, Checkbox, Label, Card } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const UserInfoPage: React.FC = () => {
    const navigate = useNavigate();

    const { isLoggedIn, token, user, role } = useSelector((state: RootState) => state.auth);
    const [userData, setUserData] = useState<any>(null);
    const [githubId, setGithubId] = useState("");
    const [isMonthlyPayment, setIsMonthlyPayment] = useState(false);
    const [accumulatedCost, setAccumulatedCost] = useState(0);
    const [balance, setBalance] = useState(0);

    const updateUserPay = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const updatedData = {
          'isMonthlyPayment': isMonthlyPayment,
          'balance': balance,
          };
        try {
          const response = await axios.post(`${API_URL}/users/${githubId}/adjust-funds`, updatedData, getHeader(token));
          console.log(response);
          toast.success("Payment was successful was updated");
          } catch(error)
          {
          const axiosError = error as AxiosError;
          toast.error(`Payment was not processed ${axiosError.message}`);
          console.error("Error:", axiosError.response || axiosError.toJSON());
        }
      }
  
    useEffect(() => {
        if (!isLoggedIn) 
            navigate("/")
        const getAuthMe = async () => {
            try {
                        const response = await axios.get(`${API_URL}/auth/me`, getHeader(token));
                        console.log(response.data);
                        const data = response.data;
                        setUserData(data);
                        setGithubId(data.githubId);
                        setIsMonthlyPayment(data.isMonthlyPayment);
                        setAccumulatedCost(data.accumulatedCost);
                        setBalance(data.balance);
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            };
        getAuthMe();
    },[]);

return (
    <div className="flex justify-center items-center min-h-screen" data-testid="user-info-page">
        <ToastContainer/>
        <div className="block h-fit w-96 overflow-scroll p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-col">
            <img className="w-24 h-24 mb-3 rounded-full shadow-lg object-contain" src={userImage} alt="User image" />
            
            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Användare: <b>{userData?.username || "No User"}</b>
            </p>

            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Email: <b>{userData?.email|| "No Email"}</b>
            </p>

            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Skapat: <b>{userData?.createdAt || "No User"}</b>
            </p>
            
            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Roll: <b>{role}</b>
            </p>
            
            <p className="font-normal text-gray-700 dark:text-gray-400 p-2">
                Github Id: <b>{userData?.githubId || ":("}</b>
            </p>
            
              <section className="bg-white dark:bg-gray-900">
                      <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Betalning för <b>{ userData?.username || "No User" }</b> </h2>
                          <form action="#" onSubmit={(e) => updateUserPay(e)}>
                              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                                  <div className="flex items-center gap-2"> 
                                  <ToggleSwitch color="blue" checked={isMonthlyPayment} label="Månatlig betalning" onChange={() => setIsMonthlyPayment(!isMonthlyPayment)} />
                                  </div>
                                  <div className="w-full">
                                      <Label htmlFor="ackkost" >Ackumulerad kostnad</Label>
                                      <TextInput color="blue" id="ackkost" type="text" value= {accumulatedCost} placeholder="" disabled/>
                                  </div>
            
                                  <div className="w-full">
                                    <Label htmlFor=" balans" >Hur mycket vill du fylla på med?</Label>
                                    <TextInput color="blue" id="balans" type="text" value={balance} onChange={(e)=> setBalance(parseFloat(e.target.value) || 0) } placeholder="" required/>
                                  </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                  <Button type="submit" color="blue">
                                    Fyll på eller uppdatera!
                                  </Button>
                                  <Button color="light">
                                    <Link to="/userlistpage">Gå tillbaka</Link>
                                  </Button>
                              </div>
                          </form>
                      </div>
                  </section>
        </div>
    </div>
);
};

export default UserInfoPage;
