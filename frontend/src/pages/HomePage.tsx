import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
    <h1 className="text-3xl font-bold mb-4 shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">Välkommen!</h1>
    <div className="space-x-4">
        <Link to="/login" className="px-4 py-2 bg-green-500 text-white rounded">
        Logga in
        </Link>
        <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded">
        Registrera dig
        </Link>
    </div>
    </div>
);
};

export default HomePage;