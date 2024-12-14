import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';
import {renderWithProviders } from '../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";

describe('Header', () => {
  it('renders Header component', () => {
    
    render(renderWithProviders(<Router><Header/></Router>));
  });
});


