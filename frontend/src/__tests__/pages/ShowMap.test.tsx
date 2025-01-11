import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import ShowMap from "../../pages/admin/ShowMap";
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from 'react-router-dom';
jest.mock("react-leaflet", () => ({
  ...jest.requireActual("react-leaflet"),
  useMap: jest.fn(() => ({
    setView: jest.fn(), // Mock setView
  })),
}));

jest.mock('axios'); // Mock Axios module

describe('ShowMap', () => {
  it('renders ShowMap component', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });
    render(renderWithProviders(<Router><ShowMap/></Router>));
    expect(screen.getByTestId("show-map")).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2)); // Ensure axios.get was called twice
  });
});


