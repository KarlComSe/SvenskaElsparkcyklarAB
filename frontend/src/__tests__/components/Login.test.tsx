import { render, screen } from '@testing-library/react';
import Login from '../../components/Login';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('Login', () => {
  it('renders Login component', () => {
    render(renderWithProviders(<Router><Login/></Router>));
    expect(screen.getByTestId("loginbutton")).toBeInTheDocument();
});
});


