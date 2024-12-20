import React from 'react';
import Map from '../components/Map';

jest.mock("react-leaflet", () => ({
  ...jest.requireActual("react-leaflet"),
  useMap: jest.fn(() => ({
    setView: jest.fn(), // Mock setView
  })),
}));

export default function ShowMap() {
  return (
    <div data-testid="show-map"><Map/></div>
  )
};
