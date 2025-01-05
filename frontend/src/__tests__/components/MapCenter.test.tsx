
import { render} from '@testing-library/react';
import MapCenter from '../../components/MapCenter';
import {renderWithProviders } from '../../helpers/test-redux';
import { LatLngExpression } from 'leaflet';
import { useMap } from 'react-leaflet';

jest.mock("react-leaflet", () => ({
  useMap: jest.fn(() => ({
    setView: jest.fn(), // Mock setView
  })),
}));


describe('MapCenter', () => {

    const mockSetView = jest.fn();
    (useMap as jest.Mock).mockReturnValue({setView: mockSetView});
    const coordinates = [-48.876667, -123.393333] as LatLngExpression;
    const zoom = 11;
    it('renders MapCenter component', () => {
      render(renderWithProviders(<MapCenter center={coordinates} zoom={zoom}/>));
      expect(mockSetView).toHaveBeenCalledWith(coordinates, 11);
  });
});


