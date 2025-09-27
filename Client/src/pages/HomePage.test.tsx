import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from '../context/AuthContext';
import HomePage from './HomePage';

// Mock the axios library
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('HomePage Component', () => {
  
  // A sample list of resources to use in our tests
  const mockResources = [
    { _id: '1', name: 'VM-Standard-1', type: 'VM', hourlyRate: 0.5 },
    { _id: '2', name: 'GPU-HighEnd-1', type: 'GPU', hourlyRate: 2.5 },
  ];
  
  // This helper function wraps the component in the necessary providers
  const renderHomePage = () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </AuthProvider>
    );
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show a loading state initially', () => {
    // Arrange: Mock the API to be in a pending state
    (mockedAxios.get as Mock).mockImplementation(() => new Promise(() => {})); // A promise that never resolves
    renderHomePage();

    // Assert: The loading text should be visible
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should display a list of resources on successful fetch', async () => {
    // Arrange: Mock the API to return our sample resources
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockResources });
    renderHomePage();

    // Assert: Wait for the component to update and check that the resource names are rendered
    await waitFor(() => {
      expect(screen.getByText('VM-Standard-1')).toBeInTheDocument();
      expect(screen.getByText('GPU-HighEnd-1')).toBeInTheDocument();
    });
  });

  it('should display a message when no resources are available', async () => {
    // Arrange: Mock the API to return an empty array
    (mockedAxios.get as Mock).mockResolvedValue({ data: [] });
    renderHomePage();

    // Assert: Wait for the component to update and check for the "no resources" message
    await waitFor(() => {
      expect(screen.getByText(/No resources available/i)).toBeInTheDocument();
    });
  });

  it('should open the reservation modal when a "Reserve" button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.get as Mock).mockResolvedValue({ data: mockResources });
    renderHomePage();

    // Act: Wait for the resources to appear, then click the first "Reserve" button
    const reserveButtons = await screen.findAllByRole('button', { name: /Reserve/i });
    await user.click(reserveButtons[0]);

    // Assert: Check that the reservation modal's title is now visible
    // This confirms the modal has opened with the correct resource
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Reserve: VM-Standard-1/i })).toBeInTheDocument();
    });
  });
});