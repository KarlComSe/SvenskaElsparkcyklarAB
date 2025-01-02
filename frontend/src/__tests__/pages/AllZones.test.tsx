import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import AllZones from '../../pages/AllBikes';

describe('AllZones', () => {
  it('renders AllZones component', () => {
    render(renderWithProviders(<Router><AllZones/></Router>));
    expect(screen.getByTestId("allzuns")).toBeInTheDocument();
  });
});


