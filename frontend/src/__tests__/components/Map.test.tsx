
import { render, screen } from '@testing-library/react';
import Map from '../../components/Map';
import {renderWithProviders } from '../../helpers/test-redux';

jest.mock("react-leaflet", () => ({
  ...jest.requireActual("react-leaflet"),
  useMap: jest.fn(() => ({
    setView: jest.fn(), // Mock setView
  })),
}));

describe('Map', () => {
  it('renders Map component', () => {
    render(renderWithProviders(<Map/>));
    expect(screen.getByTestId('map')).toBeInTheDocument(); // Find item by test-id
});
});


