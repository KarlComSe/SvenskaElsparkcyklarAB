import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, getHeader } from '../helpers/config';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  const [acceptedTerms, setAcceptedTerms] = useState(false);
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

  const handleToggle = () => {
    setAcceptedTerms((prev) => !prev); // Toggle the state
    console.log("Toggle state:", acceptedTerms); // Log the toggle state
  };

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
        setHasAcceptedTerms(user.acceptedTerms);
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
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">{user.username}</h1>
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
      </div>


      <section className="bg-white dark:bg-gray-900">
          <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Användare: { username } </h2>
              <form action="#">
                  <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Användarnamn</label>
                          <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                          focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                          dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={username} onChange={ (e)=> setUsername(e.target.value) } placeholder="användarnamn" required/>
                      </div>
                      <div className="w-full">
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
                          <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 
                          focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500
                          dark:focus:border-primary-500" value={email} onChange={ (e)=> setEmail(e.target.value) } placeholder="example@test.se" required/>
                      </div>
                      <div className="w-full">
                          <label htmlFor="githubid" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Github ID</label>
                          <input type="number" name="githubid" id="githubid" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                          block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value= {githubId} placeholder= {user.githubId} required disabled/>
                      </div>

                      <div className="w-full">
                          <label htmlFor="avatarurl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Avatarurl</label>
                          <input type="url" name="avatarurl" id="avatarurl" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                          block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value= {avatarUrl} placeholder={user.avatarUrl} onChange={ (e)=> setAvatarUrl(e.target.value || "") }required/>
                      </div>
                  
                      <div>
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kund- eller adminbehörighet</label>
                          <div className="flex items-center mb-4">
                              <input id="checkbox-1" checked={isKund} onChange={()=>setIsKund((prev) => !prev)} type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600
                              dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                              <label htmlFor="checkbox-1" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Kund</label>
                          </div>
                          <div className="flex items-center mb-4">

                              <input checked={isAdmin} onChange={()=>setIsAdmin((prev) => !prev)} id="checkbox-2" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600
                              dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                              <label htmlFor="checkbox-2" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Admin</label>
                          </div>
                      </div>

                      <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" checked={acceptedTerms}
                            onChange={handleToggle}/>
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full
                        rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300
                        after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Accepterade användarvillkor</span>
                      </label>

                      <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" checked={acceptedTerms}
                            onChange={handleToggle}/>
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full
                        rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300
                        after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Månatliga betalningar?</span>
                      </label>
                  
                      <div className="w-full">
                          <label htmlFor="ackkost" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ackumulerad kostnad</label>
                          <input type="number" name="ackkost" id="ackkost" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                          block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value= {accumulatedCost} onChange={(e)=> setAccumulatedCost(parseFloat(e.target.value) || 0) } placeholder="" required/>
                      </div>

                      <div className="w-full">
                          <label htmlFor=" balans" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Balans</label>
                          <input type="number" name=" balans" id=" balans" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                          block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value={balance} onChange={(e)=> setBalance(parseFloat(e.target.value) || 0) } placeholder="" required/>
                      </div>

                  </div>
                  <div className="flex items-center space-x-4">
                      <button type="submit" className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                          Update product
                      </button>
                      <button type="button" className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                          <svg className="w-5 h-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                          Delete
                      </button>
                  </div>
              </form>
          </div>
      </section>
    </div>
  );
};

export default AdminUserOverviewPage;
