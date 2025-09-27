import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar: React.FC = () => {
  const { user, dispatch } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    setIsOpen(false); // Close menu on logout
  };

  // Helper function to close the menu, used by links
  const closeMenu = () => setIsOpen(false);

  return (
    // Add a class to the nav when the menu is open for hamburger animation
    <nav className={`navbar ${isOpen ? 'nav-open' : ''}`}>
      <h1>
        <Link to="/" onClick={closeMenu} style={{ color: '#ecf0f1', textDecoration: 'none' }}>Cloud Rental</Link>
      </h1>

      {/* Hamburger Menu Button */}
      <button className="hamburger-menu" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      {/* Add a class to the nav links when the menu is open */}
      <ul className={`nav-links ${isOpen ? 'nav-active' : ''}`}>
        {user ? (
          <>
            {user.role === 'admin' && (
              <>
                <li>
                  <Link to="/admin/reservations" onClick={closeMenu}>Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/equipment" onClick={closeMenu}>Manage Equipment</Link>
                </li>
              </>
            )}

            <li>
              <Link to="/my-reservations" onClick={closeMenu}>My Reservations</Link>
            </li>
            <li>
              <span>Hello, {user.name}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="auth-button" style={{padding: '0.5rem 1rem'}}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={closeMenu}>Login</Link>
            </li>
            <li>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;