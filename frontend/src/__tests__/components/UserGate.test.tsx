import { render, act, waitFor } from '@testing-library/react';
import UserGate from '../../components/UserGate';
import {renderWithProviders } from '../../helpers/test-redux';
import { MemoryRouter as Router } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));
const mockNavigate = jest.fn();
jest.mock('axios'); 


describe('UserGate', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        });

        it('renders UserGate and does not redirect when admin', async () => {
            const preloadedState = {
                auth: {
                isLoggedIn: true,
                role: "admin",
                token: "test-token",
                user: "test-user"
                }
            };
            (axios.get as jest.Mock).mockResolvedValue({
                data: { roles: ['admin'] },
                    });
            await act(async() => render(renderWithProviders(<Router><UserGate/></Router>, preloadedState)))
            await waitFor(() => {
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });

        
        it('renders UserGate and does not redirect when user', async () => {
            const preloadedState = {
                auth: {
                isLoggedIn: true,
                role: "user",
                token: "test-token",
                user: "test-user"
                }
            };
            (axios.get as jest.Mock).mockResolvedValue({
                data: { roles: ['user'] },
                    });
            await act(async() => render(renderWithProviders(<Router><UserGate/></Router>, preloadedState)))
            await waitFor(() => {
                expect(mockNavigate).not.toHaveBeenCalled();
            });
        });

        it('renders UserGate and does redirect when not logged in', async () => {
            const preloadedState = {
                auth: {
                isLoggedIn: false,
                role: "guest",
                token: "test-token",
                user: "test-user"
                }
            };
            (axios.get as jest.Mock).mockResolvedValue({
                data: { roles: ['isNotLoggedIn'] },
                    });
            await act(async() => render(renderWithProviders(<Router><UserGate/></Router>, preloadedState)))
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/');
            });
        });

});


