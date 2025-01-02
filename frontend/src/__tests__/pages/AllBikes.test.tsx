import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import AllBikes from '../../pages/AllBikes';

describe('AllBikes', () => {
  it('renders AllBikes component', () => {
    render(renderWithProviders(<Router><AllBikes/></Router>));
    expect(screen.getByTestId("all-scooter-list")).toBeInTheDocument();
  });
});


