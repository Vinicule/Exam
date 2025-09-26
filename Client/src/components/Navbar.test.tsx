import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  it('should render the brand title correctly', () => {
    // Arrange: Render the component
    render(
      <AuthProvider>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthProvider>
    );

    // Act: Find the element by its text content
    const titleElement = screen.getByText(/Cloud Rental/i);

    // Assert: Check if the element is in the document
    expect(titleElement).toBeInTheDocument();
  });
});
