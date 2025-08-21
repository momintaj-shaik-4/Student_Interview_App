import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the URL for the token
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // If a token is found, save it and redirect to the dashboard
      localStorage.setItem('access_token', token);
      navigate('/dashboard', { replace: true });
    } else {
      // If no token is found in the URL, something went wrong
      console.error("Token not found in URL after OAuth callback.");
      alert('Login failed. Please try again.');
      navigate('/auth', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <p className="text-xl">Finishing login...</p>
    </div>
  );
};

export default OAuthCallback;