import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import AdminEquipmentPage from './pages/AdminEquipmentPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import ResourceDetailPage from './pages/ResourceDetailPage';


// Import the main stylesheet
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main className="app-container">
          <Routes>
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/my-reservations" 
              element={<ProtectedRoute><MyReservationsPage /></ProtectedRoute>} 
            />
            
            {/* Admin-only Routes */}
            <Route 
              path="/admin/reservations"
              element={<AdminRoute><AdminReservationsPage /></AdminRoute>}
            />
            <Route 
              path="/admin/equipment"
              element={<AdminRoute><AdminEquipmentPage /></AdminRoute>}
            />

            <Route
              path="/resource/:id"
              element={<ProtectedRoute><ResourceDetailPage /></ProtectedRoute>}
            />
            
            {/* Public Routes */}
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