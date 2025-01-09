import { render, screen } from '@testing-library/react';
import BikeList from "../../components/BikeList";

describe('BikeList', () => {
  it('renders BikeList component', () => {
    render(<BikeList scooterData={[]} isCityList={true}/>);
    expect(screen.getByTestId("bikelist")).toBeInTheDocument();
  });
});


