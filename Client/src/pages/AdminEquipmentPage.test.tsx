import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthContext, type AuthContextType } from '../context/AuthContext';
import AdminEquipmentPage from './AdminEquipmentPage';

// Mock the axios library
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('AdminEquipmentPage Component', () => {

  // Mock admin user
  const mockAdminUser = {
    _id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
  };

  // Mock equipment data
  const mockResources = [
    { _id: 'res1', name: 'Standard VM', type: 'VM', hourlyRate: 0.75, status: 'available', publishStatus: 'published' as const },
    { _id: 'res2', name: 'Test GPU', type: 'GPU', hourlyRate: 3.00, status: 'in-use', publishStatus: 'draft' as const },
  ];
  
  // Custom render function with admin context
  const renderWithAdminAuth = () => {
    const mockAuthContext: AuthContextType = {
      user: mockAdminUser,
      token: 'mock-admin-token',
      dispatch: vi.fn(),
    };

    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <MemoryRouter>
          <AdminEquipmentPage />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display a list of all existing equipment', async () => {
    // Arrange
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockResources });
    renderWithAdminAuth();

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Standard VM')).toBeInTheDocument();
      expect(screen.getByText('Test GPU')).toBeInTheDocument();
    });
  });

  it('should allow an admin to create a new piece of equipment', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.get as Mock).mockResolvedValue({ data: [] });
    (mockedAxios.post as Mock).mockResolvedValue({ data: { message: 'Created' } });
    renderWithAdminAuth();

    // Act: *** FIX: Wait for the form to be available after loading ***
    await screen.findByRole('heading', { name: /Create New Equipment/i });

    // Act: Fill out the creation form
    await user.type(screen.getByLabelText(/Name/i), 'New Powerful Server');
    await user.selectOptions(screen.getByLabelText(/Type/i), 'VM');
    await user.type(screen.getByLabelText(/vCPUs/i), '8');
    await user.type(screen.getByLabelText(/RAM \(GB\)/i), '32');
    await user.type(screen.getByLabelText(/Storage \(GB\)/i), '512');
    await user.type(screen.getByLabelText(/Hourly Rate/i), '1.25');
    await user.click(screen.getByRole('button', { name: /Create Equipment/i }));

    // Assert
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/resources',
        {
          name: 'New Powerful Server',
          type: 'VM',
          hourlyRate: 1.25,
          details: { vcpu: 8, ramGB: 32, storageGB: 512 }
        },
        expect.any(Object)
      );
    });
  });

  it('should allow an admin to delete equipment', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockResources });
    (mockedAxios.delete as Mock).mockResolvedValue({ data: { message: 'Deleted' } });
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    renderWithAdminAuth();

    // Act
    const deleteButtons = await screen.findAllByRole('button', { name: /Delete/i });
    await user.click(deleteButtons[0]);

    // Assert
    await waitFor(() => {
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/resources/res1', expect.any(Object));
    });
  });

  it('should allow an admin to change the publish status', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockResources });
    (mockedAxios.put as Mock).mockResolvedValue({ data: { message: 'Updated' } });
    renderWithAdminAuth();

    // Act: *** FIX: Find the specific row and then the combobox within it ***
    const row = await screen.findByRole('row', { name: /Test GPU/i });
    const statusSelect = within(row).getByRole('combobox');
    await user.selectOptions(statusSelect, 'published');

    // Assert
    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        '/api/resources/res2',
        { publishStatus: 'published' },
        expect.any(Object)
      );
    });
  });
});

