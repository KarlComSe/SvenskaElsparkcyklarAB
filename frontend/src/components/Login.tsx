import { Button } from 'flowbite-react';
import { GITHUB_URL } from '../helpers/config';

export default function Login(props: any) {

  const loginUser = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      window.location.href = GITHUB_URL;
  };

  return (
    <Button {...props} data-testid="loginbutton" color="success" onClick={(e) => loginUser(e)}>Logga in</Button>
  )
}
