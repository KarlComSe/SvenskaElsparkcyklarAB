import { Label, ToggleSwitch } from 'flowbite-react';
import { toast } from 'react-toastify';

type Props = {
    timerRef: React.MutableRefObject<number | null>;
    realTime: boolean;
    setRealTime: React.Dispatch<React.SetStateAction<boolean>>;
    setTrigger: React.Dispatch<React.SetStateAction<number>>
}

export default function RealTimeUpdate({timerRef, realTime, setRealTime, setTrigger} : Props) {

    const updateRealTime = () => {
        setRealTime(!realTime);
        if (realTime)
        {
          stopTimer();
          toast.info("Real Time Tracking initiated, switching back to higher resolution")
        } else {

          startTimer();
          toast.info("Real Time Tracking stopped, switching to low resolution to save resources")
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
    <div className="">
        <Label htmlFor="realtimetoggle">Vill du uppdatera kartan i realtid?</Label>
        <ToggleSwitch id="realtimetoggle" className='mx-auto' data-testid="realtimeupdate" checked={realTime} onChange={updateRealTime}>Uppdatera i realtid?</ToggleSwitch>
    </div>
  )
}
