import { render, screen } from '@testing-library/react';
import AuthData from '../../components/AuthData';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";

describe('AuthData', () => {
  it('renders AuthData component', () => {
    render(renderWithProviders(<Router><AuthData/></Router>));
    expect(screen.getByTestId('authdata')).toBeInTheDocument();
  });
});


