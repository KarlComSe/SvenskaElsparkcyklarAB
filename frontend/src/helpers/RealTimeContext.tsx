import {  createContext } from 'react'

type RealTimeContextType = {
    realTime: boolean;
    setRealTime: React.Dispatch<React.SetStateAction<boolean>>;
    isLowRes: boolean;
    setIsLowRes: React.Dispatch<React.SetStateAction<boolean>>
  };

const RealTimeContext = createContext<RealTimeContextType>({
    realTime: false,
    setRealTime: () => {},
    isLowRes: false,
    setIsLowRes: () => {},
});

export default RealTimeContext;
