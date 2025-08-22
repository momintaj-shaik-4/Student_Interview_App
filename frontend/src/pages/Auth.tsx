import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaLinkedin, FaMicrosoft } from 'react-icons/fa';
  
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });
  
  // Debug: Log formData to console (not render)
  console.log('FormData:', formData);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check URL path to determine initial state
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }

    // Handle OAuth callback
    handleOAuthCallback();
  }, [location.pathname, location.search]);

  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token') || urlParams.get('access_token');
    const error = urlParams.get('error');
    const isRegister = urlParams.get('register') === 'true';

    if (error) {
      alert(`Authentication failed: ${error}`);
      // Clean up URL
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      // Store the token
      localStorage.setItem('access_token', token);
      
      if (isRegister) {
        // If it was a registration flow, show success message
        alert('Registration successful! Welcome!');
      }
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login Logic
        const form = new FormData();
        form.append('username', formData.email);
        form.append('password', formData.password);
        const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', form);
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/dashboard');
      } else {
        // Register Logic
        await axios.post('http://127.0.0.1:8000/api/v1/auth/register', formData);
        alert('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login view after successful registration
        // Clear form data
        setFormData({
          name: '',
          email: '',
          password: '',
          city: ''
        });
      }
    } catch (error: any) {
      alert(`Authentication failed: ${error.response?.data?.detail || 'An unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {

    const redirectUrl = `http://localhost:8000/api/v1/auth/${provider}`;
    
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-2xl space-y-6 transform transition-all duration-300">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h2 className="text-3xl font-bold">{isLogin ? 'Log In' : 'Register'}</h2>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              // Clear form when switching modes
              setFormData({
                name: '',
                email: '',
                password: '',
                city: ''
              });
            }}
            className="text-teal-500 hover:underline transition-colors duration-300"
            disabled={isLoading}
          >
            Switch to {isLogin ? 'Register' : 'Log In'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City (optional)"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={isLoading}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold rounded-md bg-teal-500 hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Register')}
          </button>
        </form>
        
        <div className="flex items-center space-x-4">
          <hr className="flex-grow border-gray-700" />
          <span className="text-gray-400 text-sm">Or use social {isLogin ? 'login' : 'register'}</span>
          <hr className="flex-grow border-gray-700" />
        </div>
        
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => handleSocialLogin('google')}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
            title={`${isLogin ? 'Login' : 'Register'} with Google`}
          >
            <FaGoogle size={24} color="#f9fafb" />
          </button>  
          <button
            onClick={() => handleSocialLogin('linkedin')}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
            title={`${isLogin ? 'Login' : 'Register'} with LinkedIn`}
          >
            <FaLinkedin size={24} color="#f9fafb" />
          </button>
          <button
            onClick={() => handleSocialLogin('microsoft')}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
            disabled={isLoading}
            title={`${isLogin ? 'Login' : 'Register'} with Microsoft`}
          >
            <FaMicrosoft size={24} color="#f9fafb" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;