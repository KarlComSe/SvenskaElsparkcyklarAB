import { render, screen } from '@testing-library/react';
import App from '../../App';
import {renderWithProviders } from '../../helpers/test-redux';

describe('App', () => {
  it('renders UserListPage component', () => {
    render(renderWithProviders(<App/>));
    expect(screen.getByTestId(/app-test/i)).toBeInTheDocument();
});
});


