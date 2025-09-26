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
            {/* Admin-only links */}
            {user.role === 'admin' && (
              <>
                <li>
                  <Link to="/admin/reservations">Admin Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/equipment">Manage Equipment</Link>
                </li>
              </>
            )}

            {/* Links for all logged-in users */}
            <li>
              <Link to="/my-reservations">My Reservations</Link>
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
            {/* Links for guests */}
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
