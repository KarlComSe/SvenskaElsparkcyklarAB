import { render, screen } from '@testing-library/react';
import UserInfoPage from '../../pages/UserInfoPage';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
jest.mock("react-leaflet");

describe('UserInfoPage', () => {
  it('renders UserInfoPage component', () => {
    render(renderWithProviders(<Router><UserInfoPage/></Router>))
    expect(screen.getByTestId('user-info-page')).toBeInTheDocument();
  });
});
