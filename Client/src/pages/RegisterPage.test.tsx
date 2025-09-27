import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, type Mock, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import RegisterPage from './RegisterPage';

// Mock the axios library to prevent actual network calls during tests
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

// Mock the useNavigate hook from react-router-dom
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...original,
    useNavigate: () => mockedNavigate,
  };
});

describe('RegisterPage Component', () => {
  // Reset mocks before each test to ensure test isolation
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should render all form fields and the register button', () => {
    // Arrange
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('should show an alert if passwords do not match', async () => {
    // Arrange
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Act: Fill in ALL required fields to allow form submission
    await user.type(screen.getByLabelText(/Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password456');
    await user.click(screen.getByRole('button', { name: /Register/i }));

    // Assert: Check that the alert was called
    expect(alertMock).toHaveBeenCalledWith('Passwords do not match!');

    // Clean up
    alertMock.mockRestore();
  });

  it('should make a POST request and navigate on successful registration', async () => {
    // Arrange
    const user = userEvent.setup();
    (mockedAxios.post as Mock).mockResolvedValue({ data: { message: 'Success' } });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Act: Simulate a user filling out the form and clicking submit
    await user.type(screen.getByLabelText(/Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /Register/i }));

    // Assert: Check that axios.post was called with the correct data
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/users/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
    });

    // Assert: Check that the user is redirected to the login page
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });
});
