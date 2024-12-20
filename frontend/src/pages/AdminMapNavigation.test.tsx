import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminStartPage from './AdminStartPage';
import {renderWithProviders } from '../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import AdminMapNavigation from './AdminMapNavigation';


describe('AdminStartPage', () => {
  it('renders AdminStartPage component', () => {
    render(renderWithProviders(<Router><AdminMapNavigation/></Router>));
    expect(screen.getByText(/Utforska/i)).toBeInTheDocument();
});
});
