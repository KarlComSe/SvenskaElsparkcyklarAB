import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { toastOptionsError, toastOptionsSuccess } from '../helpers/config';
import { returnBike } from '../helpers/bike-functions';
import { toast } from 'react-toastify';
import { formatTimestamp } from '../helpers/bike-functions';

function ReturnRentButton( {tripID}  : {tripID: number | string}) {

    const { token } = useSelector((state: RootState) =>  state.auth);
    const [showTime, setShowTime] = useState(false);
    const [stopTime, setStopTime] = useState('2024-12-28T13:01:50.801Z')
    const [cost, setCost] = useState(0)
    const returnBikeId = async (tripID: number | string) => {
        const data = await returnBike(tripID, token);
        console.log(data);
        if (data.statusCode === 200)
        {
          toast.success(`Trip: ${tripID} has been ended.`, toastOptionsSuccess);
          setShowTime(true);
          setStopTime(data.stopTime || 'Unknown stop time');
          setCost(data.cost);
        } else 
        {
          toast.error("Bike was not returned", toastOptionsError);
        }
      }


  return showTime ?
    (<>
          <div className="flex items-center bg-pink-100 p-1 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300">Sluttid:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{formatTimestamp(stopTime) ?? "Still going"}</span>
              </div>
          <div className="flex items-center bg-blue-100 p-1 rounded-lg">
              <span className="font-semibold text-gray-600 dark:text-gray-300"> Kostnad:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{cost.toFixed(2).replace('.', ',')} SEK</span>
          </div>

     </>)
    :
    (
      <button data-testid="returnrentbutton" type="button" onClick={async () => await returnBikeId(tripID)} className="text-white bg-blue-700 hover:bg-blue-800
      focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5
      me-2 mb-2 focus:outline-none">
      Ongoing. Return bike</button>
    )
    
}

export default ReturnRentButton;
