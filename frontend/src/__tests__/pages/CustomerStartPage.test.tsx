import { render, screen } from '@testing-library/react';
import CustomerStartPage from '../../pages/CustomerStartPage';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('CustomerStartPage', () => {
  const preloadedState = {
    auth: {
      isLoggedIn: true,
      role: "test",
      token: "test-token",
      user: "test-user"

    }
  };
  it('renders CustomerStartPage component', () => {
    render(renderWithProviders(<Router><CustomerStartPage/></Router>, preloadedState));
    expect(screen.getByTestId("customerstartpage")).toBeInTheDocument();
    screen.debug();
});
});


