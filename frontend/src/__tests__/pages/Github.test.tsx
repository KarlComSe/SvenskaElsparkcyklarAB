import { render, screen } from '@testing-library/react';
import Github from '../../pages/Github';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";


describe('Github', () => {
  it('renders Github component', () => {
    render(renderWithProviders(<Router><Github/></Router>));
    expect(screen.getByTestId("github-test")).toBeInTheDocument();
});
});


