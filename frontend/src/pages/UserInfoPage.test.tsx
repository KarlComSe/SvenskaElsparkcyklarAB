import React from 'react';
import { render, screen } from '@testing-library/react';
import UserInfoPage from './UserInfoPage';
import {renderWithProviders } from '../helpers/test-redux';
jest.mock("react-leaflet");

describe('UserInfoPage', () => {
  it('renders UserInfoPage component', () => {
    render(renderWithProviders(<UserInfoPage/>));
    expect(screen.getByText(/Logged In/i)).toBeInTheDocument();
  });
});


