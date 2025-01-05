import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import AllZones from '../../pages/admin/AllZones';

jest.mock("react-leaflet", () => ({
    ...jest.requireActual("react-leaflet"),
    useMap: jest.fn(() => ({
      setView: jest.fn(), // Mock setView
    })),
  }));
  

describe('AllZones', () => {
  it('renders AllZones component', () => {
    render(renderWithProviders(<Router><AllZones/></Router>));
    expect(screen.getByTestId("allzones")).toBeInTheDocument();
  });
});


