import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, type AuthContextType } from '../context/AuthContext';
import AdminReservationsPage from './AdminReservationsPage';

// Mock the axios library
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('AdminReservationsPage Component', () => {

  // A mock admin user object
  const mockAdminUser = {
    _id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
  };

  // Sample reservation data from different users
  const mockReservations = [
    { 
      _id: 'res1', 
      user: { name: 'Test User 1' },
      resource: { name: 'VM-Standard-1' }, 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString(),
      status: 'pending'
    },
    { 
      _id: 'res2', 
      user: { name: 'Test User 2' },
      resource: { name: 'GPU-HighEnd-1' }, 
      startTime: new Date().toISOString(), 
      endTime: new Date().toISOString(),
      status: 'confirmed'
    },
  ];

  // A custom render function that provides an admin user context
  const renderWithAdminAuth = () => {
    const mockAuthContext: AuthContextType = {
      user: mockAdminUser,
      token: 'mock-admin-token',
      dispatch: vi.fn(),
    };

    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <AdminReservationsPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display a list of all reservations from all users', async () => {
    // Arrange: Mock the API to return reservations
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockReservations });
    renderWithAdminAuth();

    // Assert: Check that details for all reservations are displayed
    await waitFor(() => {
      expect(screen.getByText('Test User 1')).toBeInTheDocument();
      expect(screen.getByText('VM-Standard-1')).toBeInTheDocument();
      expect(screen.getByText('Test User 2')).toBeInTheDocument();
      expect(screen.getByText('GPU-HighEnd-1')).toBeInTheDocument();
    });
  });

  it('should allow an admin to change a reservation status', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockReservations });
    (mockedAxios.put as Mock).mockResolvedValue({ data: { message: 'Status updated' } });
    
    renderWithAdminAuth();

    // Act: Find the status dropdown for the first reservation and change its value
    const statusSelects = await screen.findAllByRole('combobox');
    await user.selectOptions(statusSelects[0], 'confirmed');

    // Assert: Check that the PUT endpoint was called with the correct reservation ID and new status
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        '/api/reservations/res1/status', 
        { status: 'confirmed' },
        expect.any(Object)
      );
    });
  });
});