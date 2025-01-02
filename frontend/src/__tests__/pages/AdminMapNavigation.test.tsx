
import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import AdminMapNavigation from '../../pages/AdminMapNavigation';


describe('AdminMapNavigation', () => {
  it('renders AdminMapNavigation component', () => {
    render(renderWithProviders(<Router><AdminMapNavigation/></Router>));
    expect(screen.getByText(/Utforska/i)).toBeInTheDocument();
});
});
