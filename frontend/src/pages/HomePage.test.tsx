import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import {renderWithProviders } from '../helpers/test-redux';

describe('HomePage', () => {
  it('renders HomePage component', () => {
    render(renderWithProviders(<HomePage/>));
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});


