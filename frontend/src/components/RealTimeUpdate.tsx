import { Label, ToggleSwitch } from 'flowbite-react';

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
        } else {
          startTimer();
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
    <div>
        <Label htmlFor="realtimetoggle">Vill du uppdatera kartan i realtid?</Label>
        <ToggleSwitch id="realtimetoggle" data-testid="realtimeupdate" checked={realTime} onChange={updateRealTime}>Uppdatera i realtid?</ToggleSwitch>
    </div>
  )
}
