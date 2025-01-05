import React from 'react';
import { useNavigate } from 'react-router-dom';
import stockholmImage from '../../assets/images/stockholm.jpg';
import goteborgImage from '../../assets/images/goteborg.jpg';
import malmoImage from '../../assets/images/malmo.jpg';
import AdminGate from '../../components/AdminGate';

const AdminMapNavigation: React.FC = () => {
  const navigate = useNavigate();

  const cities = [
    { name: 'Jönköping', imageUrl: stockholmImage, route: '/map/Jönköping' },
    { name: 'Göteborg', imageUrl: goteborgImage, route: '/map/Göteborg' },
    { name: 'Karlshamn', imageUrl: malmoImage, route: '/map/Karlshamn' },
  ];

  return (
    <div className="w-full max-w-5xl h-full mx-auto p-6">
      <AdminGate/>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Utforska Stadskartor
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => navigate(city.route)}
            className="relative w-full h-48 rounded-lg overflow-hidden shadow-lg group p-6"
          >
            <div className="absolute inset-0">
              <img
                src={city.imageUrl}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center">
              <span className="text-white text-xl font-bold">{city.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminMapNavigation;