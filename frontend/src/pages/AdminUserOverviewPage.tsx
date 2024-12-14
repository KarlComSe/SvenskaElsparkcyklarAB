import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL, getHeader } from '../helpers/config';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface User {
  githubId: string;
  username: string;
  email: string;
  roles: string[];
  createdAt: string;
  hasAcceptedTerms: boolean;
  avatarUrl?: string;
}

const AdminUserOverviewPage: React.FC = () => {
  const { githubId } = useParams<{ githubId: string }>();
  const { token } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${githubId}`, getHeader(token));
        setUser(response.data);
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
    return <div>Laddar användardata...</div>;
  }

  if (!user) {
    return <div>Ingen användare hittades.</div>;
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
    </div>
  );
};

export default AdminUserOverviewPage;
