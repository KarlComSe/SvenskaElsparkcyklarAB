import { Link } from 'react-router-dom';
import scooterImage from '../../assets/images/scooter.jpg';
import userImage from '../../assets/images/user.jpg';
import AdminGate from '../../components/AdminGate';
import AuthData from '../../components/AuthData';

const AdminStartPage: React.FC = () => {

  return (
        <div className='flex flex-col items-center' data-testid="adminstartpage">
            <AdminGate/>  
            <AuthData/>
            <div className="w-full max-w-lg p-4 mx-6 bg-white border border-gray-200 mb-10 rounded-lg shadow">
                <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={scooterImage} alt="Bonnie image"/>
                    <h5 className="mb-1 text-xl font-medium text-gray-900">Överblick av alla elsparkcyklar</h5>
                    <div className="flex mt-4 md:mt-6">
                        <Link to='/adminmapnavigation' className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700
                        rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">Per stad(karta)</Link>
                        <Link to='/allbikes' className="py-2 px-4 ms-2 text-sm font-medium text-white focus:outline-none bg-green-700  rounded-lg border border-gray-200 hover:bg-gray-100
                        hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Alla cyklar</Link>
                        <Link to='/allzones' className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100">Alla zoner</Link>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-lg p-4 mx-6 bg-white border border-gray-200 rounded-lg shadow">
                <div className="flex flex-col items-center pb-10">
                    <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={userImage} alt="Bonnie image"/>
                    <h5 className="mb-1 text-xl font-medium text-gray-900">Kundinformation</h5>
                    <span className="text-sm text-gray-500">Kundprofiler med saldo</span>
                    <div className="flex mt-4 md:mt-6">
                        <Link to='/userlistpage' className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">Alla användare</Link>
                    </div>
                </div>
            </div>

        </div>

      );
    };

export default AdminStartPage;