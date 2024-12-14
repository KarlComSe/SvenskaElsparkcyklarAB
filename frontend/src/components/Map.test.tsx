import React from 'react';
import { render } from '@testing-library/react';
import Map from './Map';
import {renderWithProviders } from '../helpers/test-redux';
jest.mock("react-leaflet");

describe('Map', () => {
  it('renders Map component', () => {
    render(renderWithProviders(<Map/>));
  });
});


