import { Link } from 'react-router-dom';
import userImage from '../../assets/images/user.jpg';
import Logout from '../../components/Logout';
import UserGate from '../../components/UserGate';

const CustomerStartPage: React.FC = () => {
  return (
        <div data-testid="customerstartpage" className='flex flex-col items-center'>
            <UserGate/> 
            <div className="w-full max-w-lg p-4 mx-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={userImage} alt="Bonnie image"/>
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Kontoinformation</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Se över din saldo, historik med mera</span>
                    <div className="flex flex-row mt-4 md:mt-6">
                        <Link to='/userinfopage' className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Profil</Link>
                        <Link to='/history' className="inline-flex mx-5 items-center px-4 py-2 text-sm font-medium text-center text-white bg-purple-400 rounded-lg hover:purple-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Hyr- och betalhistorik</Link>
                        <Logout/>
                    </div>
                </div>
            </div>
        </div>
  ) 

};

export default CustomerStartPage;