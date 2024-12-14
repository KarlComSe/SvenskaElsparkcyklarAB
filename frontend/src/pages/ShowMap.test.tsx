import React from 'react';
import { render } from '@testing-library/react';
import ShowMap from './ShowMap';
import {renderWithProviders } from '../helpers/test-redux';
jest.mock("react-leaflet");
import { MemoryRouter as Router } from "react-router-dom";

describe('ShowMap', () => {
  it('renders ShowMap component', () => {
    render(renderWithProviders(<ShowMap/>));
  });
});


