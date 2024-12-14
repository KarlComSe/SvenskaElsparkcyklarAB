import React from 'react';
import { render } from '@testing-library/react';
import ShowMap from './ShowMap';
import {renderWithProviders } from '../helpers/test-redux';
jest.mock("react-leaflet");

describe('ShowMap', () => {
  it('renders ShowMap component', () => {
    render(renderWithProviders(<ShowMap/>));
  });
});


