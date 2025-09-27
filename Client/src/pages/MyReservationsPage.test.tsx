import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, type AuthContextType } from '../context/AuthContext';
import MyReservationsPage from './MyReservationsPage';

// Mock the axios library
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('MyReservationsPage Component', () => {

  // A mock user object to simulate a logged-in user
  const mockUser = {
    _id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user' as const,
  };

  // Sample reservation data for our mock user
  const mockReservations = [
    { 
      _id: 'res1', 
      resource: { name: 'VM-Standard-1' }, 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString(),
      status: 'confirmed'
    },
    { 
      _id: 'res2', 
      resource: { name: 'GPU-HighEnd-1' }, 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString(),
      status: 'pending'
    },
  ];

  // A custom render function that provides a logged-in user context
  const renderWithAuth = () => {
    const mockAuthContext: AuthContextType = {
      user: mockUser,
      token: 'mock-token',
      dispatch: vi.fn(),
    };

    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <MyReservationsPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display a list of user reservations', async () => {
    // Arrange: Mock the API to return reservations
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockReservations });
    renderWithAuth();

    // Assert: Check that the reservation details are displayed
    await waitFor(() => {
      expect(screen.getByText('VM-Standard-1')).toBeInTheDocument();
      expect(screen.getByText('GPU-HighEnd-1')).toBeInTheDocument();
    });
  });

  it('should display a message if the user has no reservations', async () => {
    // Arrange: Mock the API to return an empty array
    (mockedAxios.get as Mock).mockResolvedValue({ data: [] });
    renderWithAuth();

    // Assert: Check for the "no reservations" message
    await waitFor(() => {
      expect(screen.getByText(/You have no reservations/i)).toBeInTheDocument();
    });
  });

  it('should call the delete API when a reservation is cancelled', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockReservations });
    (mockedAxios.delete as Mock).mockResolvedValue({ data: { message: 'Cancelled' } });
    
    // Mock window.confirm to always return true
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    renderWithAuth();

    // Act: Find and click the first "Cancel" button
    const cancelButtons = await screen.findAllByRole('button', { name: /Cancel Reservation/i });
    await user.click(cancelButtons[0]);

    // Assert: Check that the delete endpoint was called with the correct ID
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/reservations/res1', expect.any(Object));
    });
  });
});
