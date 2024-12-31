import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, getHeader } from '../helpers/config';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { Button, ToggleSwitch, TextInput, Checkbox, Label, Card } from "flowbite-react";
import { ToastContainer, toast } from 'react-toastify';


type User = {
  githubId: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  hasAcceptedTerms: boolean;
  avatarUrl?: string;
  accumulatedCost: number;
  balance: number;
}

const AdminUserOverviewPage: React.FC = () => {
  const { githubId } = useParams<{ githubId: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isKund, setIsKund] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isMonthlyPayment, setIsMonthlyPayment] = useState(false);
  const [accumulatedCost, setAccumulatedCost] = useState(0);
  const [balance, setBalance] = useState(0);


  const updateUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const userJson = JSON.stringify({
    //   githubId,
    //   username,
    //   email,
    //   roles: [isAdmin && "admin", isKund && "user"].filter(Boolean),
    //   hasAcceptedTerms,
    //   avatarUrl,
    //   isMonthlyPayment,
    //   accumulatedCost,
    //   balance,
    // });
    const updatedData = {
      'githubId': githubId,
      'username': username,
      'email': email,
      'roles': [isAdmin && "admin", isKund && "user"].filter(Boolean),
      'hasAcceptedTerms' :hasAcceptedTerms,
      'avatarUrl': avatarUrl,
      'isMonthlyPayment': isMonthlyPayment,
      'accumulatedCost': accumulatedCost,
      'balance': balance,
    };
    // console.log(userJson);
    try {
      const response = await axios.patch(`${API_URL}/users/${githubId}`, updatedData, getHeader(token));
      console.log(response);
      toast.success("User was updated");
    } catch(error)
    {
      const axiosError = error as AxiosError;
      toast.error(`User was not updated ${axiosError.message}`);
      console.error("Error:", axiosError.response || axiosError.toJSON());    }


  }



  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${githubId}`, getHeader(token));
        setUser(response.data);
        const user = response.data;
        setIsKund(user.roles.includes("user"));
        setIsAdmin(user.roles.includes("admin"));
        setUsername(user.username);
        setEmail(user.email);
        setCreatedAt(user.createdAt);
        setHasAcceptedTerms(user.hasAcceptedTerms);
        setAvatarUrl(user.avatarUrl ?? "");
        setIsMonthlyPayment(user.isMonthlyPayment);
        setAccumulatedCost(user.accumulatedCost);
        setBalance(user.balance);
      
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (githubId) {
      getUserInfo();
    }
  }, [githubId]);

  if (loading) {
    return <div data-testid="admin-user-overview-page">Laddar användardata...</div>;
  }

  if (!user) {
    return <div data-testid="admin-user-overview-page">Ingen användare hittades.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <ToastContainer/>
      {/* <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">{user.username}</h1>
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">Email: <b>{user.email}</b></p>
        <p className="font-normal text-gray-700 dark:text-gray-400 p-2">Skapat: <b>{user.createdAt || "No User"}</b></p>
        <p className="font-normal text-gray-700 dark:text-gray-400 p-2">Github Id: <b>{user.githubId || ":("}</b></p>
        <p className="text-gray-600 dark:text-gray-400">Roller: <b>{user.roles.join(', ')}</b></p>
        <p className="text-gray-600 dark:text-gray-400">
          <b>{user.hasAcceptedTerms ? 'Godkänt användarvillkor' : 'Ej godkänt användarvillkor'}</b>
        </p>
        {user.avatarUrl && (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="w-24 h-24 rounded-full mt-4"
          />
        )}


        <p>
            <Link to="/userlistpage" className="py-2 m-16 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-300 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Gå tillbaka
            </Link>
        </p>
      </div> */}


      <section className="bg-white dark:bg-gray-900">
          <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Användare: { username } </h2>
              <form action="#" onSubmit={(e) => updateUserInfo(e)}>
                  <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                          <Label htmlFor="name">Användarnamn</Label>
                          <TextInput color="blue" id="name" type="text" value={username} onChange={ (e)=> setUsername(e.target.value) } placeholder="användarnamn" required/>
                      </div>

                      <div className="sm:col-span-2">
                          <Label htmlFor="created" >Registrerad(readonly)</Label>
                          <TextInput color="blue" id="created" type="text" value={createdAt} disabled required/>
                      </div>

                      <div className="w-full">
                          <Label htmlFor="email" >E-mail</Label>
                          <TextInput color="blue" id="email" type="email" value={email} onChange={ (e)=> setEmail(e.target.value) } placeholder="example@test.se" required/>
                      </div>

                      <div className="w-full">
                          <Label htmlFor="githubid" >Github ID (readonly)</Label>
                          <TextInput color="blue" id="githubid" type="text" value= {githubId} placeholder={user.githubId} required disabled/>
                      </div>

                      <div className="w-full">
                          <Label htmlFor="avatarurl" >Avatarurl</Label>
                          <TextInput color="blue" id="avatarurl" type="url" value= {avatarUrl} placeholder={user.avatarUrl} onChange={ (e)=> setAvatarUrl(e.target.value || "") }/>
                          <Card
                              className="max-w-sm mx-auto mt-6 inline-block"
                              imgAlt="user image"
                              imgSrc={avatarUrl}/>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox id="kund" color="blue" checked={isKund} onChange={()=>setIsKund(!isKund)} />
                        <Label htmlFor="kund" className="flex">Kundbehörighet</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="admin" color="blue" checked={isAdmin} onChange={()=>setIsAdmin(!isAdmin)} />
                        <Label htmlFor="admin">Adminbehörighet</Label>
                      </div>
                      <div className="flex items-center gap-2"> 
                      <ToggleSwitch color="blue" checked={isMonthlyPayment} label="Månatlig betalning" onChange={() => setIsMonthlyPayment(!isMonthlyPayment)} />
                      <ToggleSwitch color="teal" checked={hasAcceptedTerms} label="Godkända användarvillkor" onChange={() => setHasAcceptedTerms(!hasAcceptedTerms)} />
                      </div>
                      <div className="w-full">
                          <Label htmlFor="ackkost" >Ackumulerad kostnad</Label>
                          <TextInput color="blue" id="ackkost" type="text" value= {accumulatedCost} onChange={(e)=> setAccumulatedCost(parseFloat(e.target.value) || 0) } placeholder="" required/>
                      </div>

                      <div className="w-full">
                        <Label htmlFor=" balans" >Balans</Label>
                        <TextInput color="blue" id="balans" type="text" value={balance} onChange={(e)=> setBalance(parseFloat(e.target.value) || 0) } placeholder="" required/>

                      </div>

                  </div>
                  <div className="flex items-center space-x-4">
                      <Button type="submit" color="blue">
                        Uppdatera
                      </Button>
                      <Button color="failure">
                        Radera (inte implementerad än)
                      </Button>
                      <Button color="light">
                        <Link to="/userlistpage">Gå tillbaka</Link>
                      </Button>
                  </div>
              </form>
          </div>
      </section>
    </div>
  );
};

export default AdminUserOverviewPage;
