import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, getHeader } from '../../helpers/config';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { Button, ToggleSwitch, TextInput, Checkbox, Label, Card } from "flowbite-react";
import { toast } from 'react-toastify';
import AdminGate from '../../components/AdminGate';

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
  const [isDeleted, setIsDeleted] = useState(false);
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
    const updatedData = {
      'githubId': githubId,
      'username': username,
      'email': email,
      'roles': [isAdmin && "admin", isKund && "user",  isDeleted && "inactive"].filter(Boolean),
      'hasAcceptedTerms': hasAcceptedTerms,
      'avatarUrl': avatarUrl,
      'isMonthlyPayment': isMonthlyPayment,
      'accumulatedCost': accumulatedCost,
      'balance': balance,
      };
    try {
      const response = await axios.patch(`${API_URL}/users/${githubId}`, updatedData, getHeader(token));
      console.log(response);
      toast.success("User was updated");
      } catch(error)
      {
      const axiosError = error as AxiosError;
      toast.error(`User was not updated ${axiosError.message}`);
      console.error("Error:", axiosError.response || axiosError.toJSON());
    }
  }



  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${githubId}`, getHeader(token));
        setUser(response.data);
        const user = response.data;
        setIsKund(user.roles.includes("user"));
        setIsAdmin(user.roles.includes("admin"));
        setIsDeleted(user.roles.includes("inactive"));
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
  }, [githubId, token]);

  if (loading) {
    return <div data-testid="admin-user-overview-page">Laddar användardata...</div>;
  }

  if (!user) {
    return <div data-testid="admin-user-overview-page">Ingen användare hittades.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
      <AdminGate/>

      <section className="bg-white">
          <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Användare: { username }
              {isDeleted &&
              <span className="text-red-600 text-xl">(AVAKTIVERAD)</span>}
              </h2>
              <form action="#" onSubmit={(e) => updateUserInfo(e)}>
                  <div className="grid gap-4 mb-4">
                      <div className="">
                          <Label htmlFor="name">Användarnamn</Label>
                          <TextInput color="blue" id="name" type="text" value={username} onChange={ (e)=> setUsername(e.target.value) } placeholder="användarnamn" required/>
                      </div>

                      <div className="">
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
                        <Checkbox id="delete" color="red" checked={isDeleted} onChange={()=>setIsDeleted(!isDeleted)} />
                        <Label htmlFor="delete" className="text-red-600 font-bold">Avaktiverad</Label>
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
