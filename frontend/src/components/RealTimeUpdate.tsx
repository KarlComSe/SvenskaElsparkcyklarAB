import { useContext } from 'react';
import RealTimeContext from '../helpers/RealTimeContext';
import { Label, ToggleSwitch } from 'flowbite-react';
import { toast } from 'react-toastify';

type Props = {
    timerRef: React.MutableRefObject<number | null>;
    setTrigger: React.Dispatch<React.SetStateAction<number>>
}

export default function RealTimeUpdate({timerRef, setTrigger} : Props) {
    const {realTime, setRealTime, isLowRes, setIsLowRes} = useContext(RealTimeContext);

    const updateRealTime = () => {
        setRealTime(!realTime);
        if (realTime)
        {
          stopTimer();
          setIsLowRes(false);
          toast.info("Real Time Tracking stopped, switching back to higher resolution.")
        } else {
          startTimer();
          setIsLowRes(true);

          toast.info("Real Time Tracking initiated, switching to low resolution to save resources.")
        }
      }

      const startTimer = () => {
        if (!timerRef.current)
          {
            timerRef.current = setInterval(() => {
              setTrigger((prev: number) => prev + 1);
            }, 1000);
          }
    };
  
    const stopTimer = () => {
        if (timerRef.current)
          {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
    };
    
  return (
    <>
    <div className="flex flex-col items-center justify-center my-2 py-2 bg-red-100 rounded-md w-full sm:max-w-xl mx-auto">
        <Label htmlFor="realtimetoggle">Vill du uppdatera kartan i realtid?</Label>
        <ToggleSwitch id="realtimetoggle" className='mx-auto' data-testid="realtimeupdate" checked={realTime} onChange={updateRealTime}>Uppdatera i realtid?</ToggleSwitch>
        </div>

        { realTime &&
        <div className="flex flex-col items-center justify-center my-2 py-2 bg-blue-100 rounded-md w-full sm:max-w-xl mx-auto">
          <Label htmlFor="forcehighres">Vill du tvinga högre upplösning på markörer och karta?</Label>
          <ToggleSwitch id="forcehighres" color="blue" className='mx-auto' checked={!isLowRes} onChange={() => setIsLowRes(!isLowRes)}>Högre upplösning?</ToggleSwitch>
        </div>
        }
    </>
  )
}
