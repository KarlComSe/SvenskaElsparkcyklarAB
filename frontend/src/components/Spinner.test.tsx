import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders Spinner component', () => {
    render(<Spinner spinnerColor='red'/>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    
  });
});