import { render, screen } from '@testing-library/react';
import ShowMap from "../../pages/ShowMap";
import {renderWithProviders } from '../../helpers/test-redux';
jest.mock("react-leaflet", () => ({
  ...jest.requireActual("react-leaflet"),
  useMap: jest.fn(() => ({
    setView: jest.fn(), // Mock setView
  })),
}));


describe('ShowMap', () => {
  it('renders ShowMap component', () => {
    render(renderWithProviders(<ShowMap/>));
    expect(screen.getByTestId("show-map")).toBeInTheDocument();
  });
});


