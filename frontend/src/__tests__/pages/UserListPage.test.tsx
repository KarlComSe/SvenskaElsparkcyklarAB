import { render, screen } from '@testing-library/react';
import UserListPage from '../../pages/admin/UserListPage';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('UserListPage', () => {
  it('renders UserListPage component', () => {
    render(renderWithProviders(<Router><UserListPage/></Router>));
    expect(screen.getByText(/Laddar/i)).toBeInTheDocument();
});
});


