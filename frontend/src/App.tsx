// src/App.tsx (Correct)
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import OAuthCallback from './pages/OAuthCallback';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { useState, useEffect } from 'react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Routes> // Start directly with Routes
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/google-login" element={<OAuthCallback />} />
      <Route path="/linkedin-login" element={<OAuthCallback />} />
      <Route path="/microsoft-login" element={<OAuthCallback />} />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;