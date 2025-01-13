import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { API_URL, getHeader } from '../../helpers/config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminGate from '../../components/AdminGate';

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
    <div className="w-full max-w-4xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow">
      <AdminGate/>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Användarlista</h1>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.githubId}
            className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">

            <h2 className="text-lg font-semibold text-gray-800">
              <Link to={`/user/${user.githubId}`} className="text-blue-500 hover:underline">
                {user.username}              {user?.roles?.includes("inactive") &&
              <span className="text-red-600 text-xl">(AVAKTIVERAD)</span>}
              </Link>
              </h2>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">Roller: {user.roles.join(', ')}</p>
            <p className="text-gray-600">
              {user.hasAcceptedTerms
                ? 'Godkänt användarvillkor'
                : 'Ej godkänt användarvillkor'}
            </p>
            {user.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt={`${user.username}'s avatar`}
                className="flex mx-auto w-16 h-16 rounded-full mt-4"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListPage;