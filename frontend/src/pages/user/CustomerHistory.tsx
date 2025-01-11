import { useState, useEffect } from 'react';
import { RootState } from '../../redux/store/store';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { allRentals, Rental } from '../../helpers/bike-functions';
import UserGate from '../../components/UserGate';
import ReturnRentButton from '../../components/ReturnRentButton';
import { formatTimestamp } from '../../helpers/other-functions';

export default function CustomerHistory() {
  const { isLoggedIn, user, token } = useSelector((state: RootState) =>  state.auth);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const navigate = useNavigate();
  const [refreshTrigger] = useState(0);

  useEffect(() => {
    if(!isLoggedIn) {
      navigate('/');
    }
  },[isLoggedIn, navigate]);

  useEffect(() => {
    const getRentals = async () => {
        if (user && token) {

            setRentals([]);
            setTimeout(async () => {
              const rentalData = await allRentals(token);
              rentalData.reverse()
              setRentals(rentalData)}
              , 100);

        }
    };
    getRentals();
  }, [user, token, refreshTrigger]);


  return (
    <div data-testid="my-rentals" className='p-4 flex flex-col justify-center items-center'>
      <UserGate/>
      <div>
        <h2 className="text-2xl font-bold text-gray-900"> Mina resor </h2> 
        </div>
      <ul className="w-full sm:max-w-xl">
          { rentals.map((rental, index) => (
          <li key={index} className="flex flex-col flex-nowrap items-center justify-center gap-4 p-4 mb-6 bg-gray-100 rounded-lg shadow-md dark:bg-gray-700 sm:flex-row">
          <div className="flex items-center bg-purple-100 p-1 rounded-lg">
              <span className="font-semibold">id:</span>
              <span className="ml-2">{rental.id}</span>
          </div>
          <div className="flex items-center bg-green-100 p-1 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Starttid</span>
              <span className="ml-2 text-gray-800 dark:text-white">{formatTimestamp(rental.startTime)}</span>
          </div>
          {!rental.stopTime && 
              <ReturnRentButton tripID={rental.id}/>
          } 
          {rental.stopTime &&
          <>
          <div className="flex items-center bg-pink-100 p-1 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Sluttid:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{formatTimestamp(rental.stopTime) ?? "Still going"}</span>
              </div>
          <div className="flex items-center bg-blue-100 p-1 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300"> Kostnad:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{rental.cost.toFixed(2).replace('.', ',')} SEK</span>
          </div>
          </>
          }
          </li>
          )) }
      </ul>
    </div>
  )
}
