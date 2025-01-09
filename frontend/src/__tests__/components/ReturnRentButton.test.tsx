import { render, screen } from '@testing-library/react';
import {renderWithProviders } from '../../helpers/test-redux';
import ReturnRentButton from '../../components/ReturnRentButton';

describe('ReturnRentButton', () => {
  it('renders ReturnRentButton', () => {
    const preloadedState = {
        auth: {
          isLoggedIn: true,
          role: "test",
          token: "test-token",
          user: "test-user"
 
        }
      };
    render(renderWithProviders( <ReturnRentButton tripID={"testa"}/>, preloadedState));
    expect(screen.getByTestId("returnrentbutton")).toBeInTheDocument();
  });
});
