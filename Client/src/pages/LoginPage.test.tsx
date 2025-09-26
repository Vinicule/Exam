import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from './LoginPage';

describe('LoginPage Component', () => {
  it('should allow a user to type into the email and password fields', () => {
    // Arrange
    render(
      <AuthProvider>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthProvider>
    );

    // Act: Find the input fields
    const emailInput = screen.getByLabelText(/Email Address/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Act: Simulate typing into the fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert: Check if the input values have been updated
    expect(emailInput).toHaveAttribute('value', 'test@example.com');
    expect(passwordInput).toHaveAttribute('value', 'password123');
  });
});