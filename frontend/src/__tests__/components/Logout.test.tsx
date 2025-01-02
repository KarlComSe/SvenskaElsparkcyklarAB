import { render, screen } from '@testing-library/react';
import Logout from '../../components/Logout';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('Logout', () => {
  it('renders Logout component', () => {
    render(renderWithProviders(<Router><Logout/></Router>));
    expect(screen.getByTestId("logoutbutton")).toBeInTheDocument();
});
});


