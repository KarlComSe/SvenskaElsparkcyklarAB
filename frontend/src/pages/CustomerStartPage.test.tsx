import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomerStartPage from './CustomerStartPage';
import {renderWithProviders } from '../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('CustomerStartPage', () => {
  it('renders CustomerStartPage component', () => {
    render(renderWithProviders(<Router><CustomerStartPage/></Router>));
    expect(screen.getByText(/Hyr en elsparkcykel/i)).toBeInTheDocument();
});
});


