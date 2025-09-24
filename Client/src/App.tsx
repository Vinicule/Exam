import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; // *** NEW: Import ProtectedRoute ***
import PublicRoute from './components/PublicRoute';   // *** NEW: Import PublicRoute ***

// Import the main stylesheet
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main className="app-container">
          <Routes>
            {/* Protected Routes: Only accessible when logged in */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Public Routes: Only accessible when logged out */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
