import { render, screen } from '@testing-library/react';
import Spinner from '../../components/Spinner';

describe('Spinner', () => {
  it('renders Spinner component', () => {
    render(<Spinner spinnerColor='red'/>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    
  });
});