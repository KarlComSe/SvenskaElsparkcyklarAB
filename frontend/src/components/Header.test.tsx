import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';
import {renderWithProviders } from '../helpers/test-redux';

describe('Header', () => {
  it('renders Header component', () => {
    render(renderWithProviders(<Header/>));
  });
});


