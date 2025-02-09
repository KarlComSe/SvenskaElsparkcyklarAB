import { render, screen } from '@testing-library/react';
import AdminStartPage from '../../pages/admin/AdminStartPage';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('AdminStartPage', () => {
  it('renders AdminStartPage component', () => {
    render(renderWithProviders(<Router><AdminStartPage/></Router>));
    expect(screen.getByTestId("adminstartpage")).toBeInTheDocument();
});
});


