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

const ProtectedContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      {children}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />

        <main className="main-content-flow"> 
          <Routes>
            {/* Protected Routes - Wrap these in ProtectedContentWrapper */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProtectedContentWrapper>
                    <HomePage />
                  </ProtectedContentWrapper>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/my-reservations" 
              element={
                <ProtectedRoute>
                  <ProtectedContentWrapper>
                    <MyReservationsPage />
                  </ProtectedContentWrapper>
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes - Wrap these in ProtectedContentWrapper */}
            <Route 
              path="/admin/reservations"
              element={
                <AdminRoute>
                  <ProtectedContentWrapper>
                    <AdminReservationsPage />
                  </ProtectedContentWrapper>
                </AdminRoute>
              }
            />
            <Route 
              path="/admin/equipment"
              element={
                <AdminRoute>
                  <ProtectedContentWrapper>
                    <AdminEquipmentPage />
                  </ProtectedContentWrapper>
                </AdminRoute>
              }
            />

            <Route
              path="/resource/:id"
              element={
                <ProtectedRoute>
                  <ProtectedContentWrapper>
                    <ResourceDetailPage />
                  </ProtectedContentWrapper>
                </ProtectedRoute>
              }
            />
            {/* Public Routes - No wrapper needed */}
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
