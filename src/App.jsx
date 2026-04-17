import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAuth from './pages/AdminAuth';
import MissionPage from './pages/MissionPage';
import AdminProfile from './pages/AdminProfile';

// A simple auth guard component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  // In a real app we might verify the JWT here too.
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/admin/login" element={<AdminAuth />} />
        <Route path="/admin/*" element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
