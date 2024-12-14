import React from 'react';
export const MapContainer = jest.fn(({ children }) => <div>{children}</div>);
export const TileLayer = jest.fn(() => <div>TileLayer</div>);
export const Marker = jest.fn(() => <div>Marker</div>);
export const Popup = jest.fn(() => <div>Popup</div>);
export const Polygon = jest.fn(() => <div>Polygon</div>);
export const useMap = jest.fn(() => ({
  addLayer: jest.fn(),
  removeLayer: jest.fn(),
}));
