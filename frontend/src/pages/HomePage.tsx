import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

import Login from '../components/Login';

const HomePage: React.FC = () => {

  const { isLoggedIn } = useSelector((state: RootState) =>  state.auth);

  return (
    <div className="flex flex-col items-center justify-center h-screen" data-testid="home-page">
        { isLoggedIn 
        ?
        (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-800 dark:text-blue">Du är inloggad</h5>
          </div>
        )
        :
          (<>
            <h1 className="text-2xl font-bold mb-4 text-green-500">Logga in via Guthub</h1>
            <Login/>
          </>
          )
      }
    </div>
  );
};

export default HomePage;