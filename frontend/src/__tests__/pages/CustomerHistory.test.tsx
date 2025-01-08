import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import CustomerHistory from "../../pages/user/CustomerHistory"

describe('CustomerHistory', () => {
  it('renders CustomerHistory component', () => {
    render(renderWithProviders(<Router><CustomerHistory/></Router>));
    expect(screen.getByTestId("my-rentals")).toBeInTheDocument();
  });
});


