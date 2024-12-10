import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store';
import { API_URL, getHeader } from '../helpers/config';
import axios from 'axios';

interface User {
  githubId: string;
  username: string;
  email: string;
  roles: string[];
  hasAcceptedTerms: boolean;
  avatarUrl?: string;
}

const UserListPage: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usersFromBackend = async () => {
      try {
        const response = await axios.get(`${API_URL}/users`, getHeader(token));
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    usersFromBackend();
  }, [token]);

  if (loading) {
    return <div>Laddar användarlistan...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Användarlista</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.githubId}
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700"
          >
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">Email: {user.email}</p>
            <p className="text-gray-600 dark:text-gray-400">Roller: {user.roles.join(', ')}</p>
            <p className="text-gray-600 dark:text-gray-400">
              {user.hasAcceptedTerms
                ? 'Godkänt användarvillkor'
                : 'Ej godkänt användarvillkor'}
            </p>
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                className="w-16 h-16 rounded-full mt-4"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;