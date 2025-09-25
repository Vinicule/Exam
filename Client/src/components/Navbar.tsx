import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar: React.FC = () => {
  const { user, dispatch } = useAuthContext();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <nav className="navbar">
      <h1>
        <Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Cloud Rental</Link>
      </h1>
      <ul className="nav-links">
        {user ? (
          <>
            {/* Admin-only link */}
            {user.role === 'admin' && (
              <li>
                <Link to="/admin/reservations">Admin Dashboard</Link>
              </li>
            )}
            <li>
              <Link to="/my-reservations">My Reservations</Link>
            </li>
            <li>Hello, {user.name}</li>
            <li>
              <button onClick={handleLogout} className="auth-button" style={{padding: '0.5rem 1rem'}}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;