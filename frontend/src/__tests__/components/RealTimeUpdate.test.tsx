import { render, screen } from '@testing-library/react';
import RealTimeUpdate from "../../components/RealTimeUpdate";
import {renderWithProviders } from '../../helpers/test-redux';

describe('RealTimeUpdate', () => {
  const timerRef = { current: null };
  const setRealTime = jest.fn();
  const setTrigger = jest.fn();
  const realTime = false; // Initial state
  it('renders RealTimeUpdate component', async () => {
    render(renderWithProviders(<RealTimeUpdate timerRef={timerRef} setRealTime={setRealTime} setTrigger={setTrigger} realTime={realTime} />));
    expect(screen.getByTestId("realtimeupdate")).toBeInTheDocument();

  });
});


