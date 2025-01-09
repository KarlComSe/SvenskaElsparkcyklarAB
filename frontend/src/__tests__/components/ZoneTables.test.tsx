import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import ZoneTables from '../../components/ZoneTables';
import { Zone } from '../../helpers/map/leaflet-types'

describe('ZoneTables', () => {
    const mockZones: Zone[] = [{
            id: "",
            polygon: [
                {
                  "lat": 57.7066,
                  "lng": 11.9384
                },
                {
                  "lat": 57.7069,
                  "lng": 11.939
                },
                {
                  "lat": 57.7067,
                  "lng": 11.9396
                },
                {
                  "lat": 57.7064,
                  "lng": 11.939
                },
                {
                  "lat": 57.7066,
                  "lng": 11.9384
                }
              ],
            type: "parking"
    }]
  it('renders ZoneTables component', () => {
    render(renderWithProviders(<Router><ZoneTables zoneData={mockZones}/></Router>));
    expect(screen.getByTestId("zonetables")).toBeInTheDocument();
  });
});


