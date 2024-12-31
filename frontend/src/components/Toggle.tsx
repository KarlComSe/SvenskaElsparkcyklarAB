import  { useState } from 'react'
import { ToggleSwitch } from "flowbite-react";



export default function Toggle() {
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(true);

  return (
    <div className="flex max-w-md flex-col items-start gap-4">
      <ToggleSwitch checked={switch1} label="Toggle me" onChange={setSwitch1} />
      <ToggleSwitch checked={switch2} label="Toggle me (checked)" onChange={setSwitch2} />
      <ToggleSwitch checked={false} disabled label="Toggle me (disabled)" onChange={() => undefined} />
      <ToggleSwitch checked={true} disabled label="Toggle me (disabled)" onChange={() => undefined} />
      <ToggleSwitch checked={switch3} onChange={setSwitch3} />
    </div>
  );
}