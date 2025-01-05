import { render, screen } from '@testing-library/react';
import AdminUserOverviewPage from '../../pages/admin/AdminUserOverviewPage';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('AdminUserOverviewPage', () => {
  it('renders AdminUserOverviewPage component', () => {
    render(renderWithProviders(<Router><AdminUserOverviewPage/></Router>));
    expect(screen.getByTestId('admin-user-overview-page')).toBeInTheDocument();
});
});


