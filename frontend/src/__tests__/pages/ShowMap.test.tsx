import { render, screen } from '@testing-library/react';
import ShowMap from "../../pages/admin/ShowMap";
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from 'react-router-dom';
jest.mock("react-leaflet", () => ({
  ...jest.requireActual("react-leaflet"),
  useMap: jest.fn(() => ({
    setView: jest.fn(), // Mock setView
  })),
}));


describe('ShowMap', () => {
  it('renders ShowMap component', () => {
    render(renderWithProviders(<Router><ShowMap/></Router>));
    expect(screen.getByTestId("show-map")).toBeInTheDocument();
  });
});


