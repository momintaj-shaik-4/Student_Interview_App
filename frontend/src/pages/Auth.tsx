import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';

// The main authentication component with an elegant, modern, and clean design.
// This version uses a light color scheme and subtle animations for a sophisticated feel.
const Auth = () => {
  // State to manage the view: true for login, false for registration.
  const [isLogin, setIsLogin] = useState<boolean>(true);
  // State to show a loading spinner or disable buttons during an API call.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State for displaying success or error messages to the user.
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });
  // State to hold the form data for login and registration.
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: ''
  });

  // Hooks from react-router-dom to handle navigation and access URL data.
  const navigate = useNavigate();
  const location = useLocation();

  // Effect hook to handle initial state based on URL path and OAuth callbacks.
  useEffect(() => {
    // Set the initial view based on the URL pathname.
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
    // Check for social login redirects and process them.
    handleOAuthCallback();
  }, [location.pathname, location.search]);

  // Handles the redirection from social login providers, extracting tokens and errors from the URL.
  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token') || urlParams.get('access_token');
    const error = urlParams.get('error');
    const isRegister = urlParams.get('register') === 'true';

    if (error) {
      // If an error is present, display it and redirect to the login page.
      setStatusMessage({ text: `Authentication failed: ${error}`, type: 'error' });
      navigate('/login', { replace: true });
      return;
    }

    if (token) {
      // If a token is found, store it and navigate to the dashboard.
      localStorage.setItem('access_token', token);
      if (isRegister) {
        setStatusMessage({ text: 'Registration successful! Welcome!', type: 'success' });
      }
      navigate('/dashboard', { replace: true });
    }
  };

  // Updates form data on input change and clears any existing status messages.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatusMessage({ text: '', type: '' });
  };

  // Handles form submission for email/password login and registration.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      if (isLogin) {
        // Handle login submission
        const form = new FormData();
        form.append('username', formData.email);
        form.append('password', formData.password);
        const response = await axios.post('http://127.0.0.1:8000/api/v1/auth/login', form);
        localStorage.setItem('access_token', response.data.access_token);
        setStatusMessage({ text: 'Login successful!', type: 'success' });
        navigate('/dashboard');
      } else {
        // Handle registration submission
        await axios.post('http://127.0.0.1:8000/api/v1/auth/register', formData);
        setStatusMessage({ text: 'Registration successful! Please log in.', type: 'success' });
        // After successful registration, switch to the login view.
        setIsLogin(true);
        // Clear the form data and navigate to the login route.
        setFormData({
          name: '',
          email: '',
          password: '',
          city: ''
        });
        navigate('/login', { replace: true });
      }
    } catch (error: unknown) {
      // Handle different types of errors from the API call.
      if (axios.isAxiosError(error)) {
        setStatusMessage({ text: `Authentication failed: ${error.response?.data?.detail || 'An unknown error occurred'}`, type: 'error' });
      } else {
        setStatusMessage({ text: 'An unexpected error occurred.', type: 'error' });
      }
    } finally {
      // Always stop the loading state after the API call completes.
      setIsLoading(false);
    }
  };

  // A type for the social login providers.
  type SocialProvider = 'google' | 'microsoft' | 'linkedin';

  // Redirects the user to the social login provider's page.
  const handleSocialLogin = (provider: SocialProvider) => {
    const redirectUrl = `http://localhost:8000/api/v1/auth/${provider}`;
    window.location.href = redirectUrl;
  };

  // JSX for the reusable, styled social login buttons.
  const socialLoginButtons = (
    <div className="space-y-4 w-full">
      <button
        onClick={() => handleSocialLogin('google')}
        className="w-full py-3 flex items-center justify-center gap-3 rounded-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-300 shadow-sm"
        disabled={isLoading}
      >
        {/* Google SVG Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M21.5,12.25c0-1.87-0.15-3.6-0.45-5.2H12v3.91h5.19c-0.21,1.14-0.95,2.05-2.02,2.66v2.54h3.27C20.66,15.74,21.5,14.15,21.5,12.25z"/>
          <path fill="#34A853" d="M12,22c2.97,0,5.48-0.98,7.31-2.66l-3.27-2.54c-0.91,0.61-2.07,0.96-3.74,0.96c-2.88,0-5.32-1.93-6.2-4.52H2.89v2.62C4.85,20.44,8.19,22,12,22z"/>
          <path fill="#FBBC05" d="M5.8,14.68c-0.25-0.73-0.39-1.5-0.39-2.29s0.14-1.56,0.39-2.29V7.52H2.89C2.26,8.81,1.9,10.37,1.9,12s0.36,3.19,0.99,4.48L5.8,14.68z"/>
          <path fill="#EA4335" d="M12,4.4c1.65,0,3.13,0.57,4.31,1.52l2.91-2.83C17.48,1.6,14.97,0,12,0C8.19,0,4.85,1.56,2.89,4.52l2.91,2.28C6.68,5.43,9.12,4.4,12,4.4z"/>
        </svg>
        Sign in with Google
      </button>
      <button
        onClick={() => handleSocialLogin('microsoft')}
        className="w-full py-3 flex items-center justify-center gap-3 rounded-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-300 shadow-sm"
        disabled={isLoading}
      >
        {/* Microsoft SVG Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
          <rect x="2" y="2" width="9" height="9" fill="#F25022"/>
          <rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
          <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
          <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
        </svg>
        Sign in with Microsoft
      </button>
      <button
        onClick={() => handleSocialLogin('linkedin')}
        className="w-full py-3 flex items-center justify-center gap-3 rounded-full font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-300 shadow-sm"
        disabled={isLoading}
      >
        {/* LinkedIn SVG Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#0A66C2" d="M20.447 20.452h-3.554v-5.569c0-1.353-.024-3.094-1.884-3.094-1.886 0-2.175 1.477-2.175 3.006v5.657h-3.554V9.293h3.411v1.579h.048c.478-.908 1.636-1.868 3.364-1.868 3.592 0 4.256 2.369 4.256 5.441v6.457zM5.449 7.331c-1.144 0-2.071-.926-2.071-2.068 0-1.143.927-2.068 2.071-2.068 1.143 0 2.072.925 2.072 2.068 0 1.142-.929 2.068-2.072 2.068zm1.751 13.121H3.698V9.293h3.502v11.159z"/>
        </svg>
        Sign in with LinkedIn
      </button>
    </div>
  );

  return (
    // Main container with a soft, gradient background and centering styles.
    <div className="relative min-h-screen font-sans antialiased overflow-hidden flex items-center justify-center">

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-gray-100 to-teal-100 -z-10">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-teal-400 opacity-30 rounded-full animate-float blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400 opacity-20 rounded-full animate-float-delay-1 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-emerald-400 opacity-30 rounded-full animate-float-delay-2 blur-3xl"></div>
      </div>

      {/* The main card container for both login and signup panels.
          Applying a clean, floating effect with a subtle shadow and rounded corners. */}
      <div className="relative z-10 w-full max-w-lg p-8 sm:p-12 space-y-8 flex flex-col items-center justify-center
                      bg-white/80 rounded-[2rem] backdrop-blur-xl
                      shadow-2xl shadow-gray-200/50
                      transform transition-all duration-500 ease-in-out">
        
        {/* Conditionally render the forms with a fade/scale animation */}
        {isLogin ? (
          <div className="w-full transition-all duration-500 transform scale-100 opacity-100">
            {/* Login Panel */}
            <div className="text-center w-full">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-base">
                Sign in to your account.
              </p>
            </div>

            {/* Status Message Display */}
            {statusMessage.text && (
              <div className={`w-full px-5 py-3 rounded-xl text-sm transition-all duration-300 border ${statusMessage.type === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                {statusMessage.text}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 border border-transparent focus:border-cyan-400 focus:scale-[1.01] hover:shadow-md"
                required
                disabled={isLoading}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 border border-transparent focus:border-cyan-400 focus:scale-[1.01] hover:shadow-md"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`w-full py-4 mt-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 transition-all duration-300 shadow-md transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-cyan-300
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center my-6 w-full">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-400 text-sm font-semibold">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {socialLoginButtons}

            <div className="text-center text-gray-500 text-sm mt-6">
              <p>
                Don't have an account?
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setFormData({ name: '', email: '', password: '', city: '' });
                    setStatusMessage({ text: '', type: '' });
                  }}
                  className="ml-1 font-semibold text-cyan-500 hover:text-cyan-400 hover:underline transition-colors duration-300"
                  disabled={isLoading}
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full transition-all duration-500 transform scale-100 opacity-100">
            {/* Sign-Up Panel */}
            <div className="text-center w-full">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-500 text-base">
                Sign up to get started.
              </p>
            </div>

            {/* Status Message Display */}
            {statusMessage.text && (
              <div className={`w-full px-5 py-3 rounded-xl text-sm transition-all duration-300 border ${statusMessage.type === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                {statusMessage.text}
              </div>
            )}

            {/* Sign-up Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 border border-transparent focus:border-cyan-400 focus:scale-[1.01] hover:shadow-md"
                required
                disabled={isLoading}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 border border-transparent focus:border-cyan-400 focus:scale-[1.01] hover:shadow-md"
                required
                disabled={isLoading}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 border border-transparent focus:border-cyan-400 focus:scale-[1.01] hover:shadow-md"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City (optional)"
                className="w-full px-5 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all duration-300 border border-transparent focus:border-cyan-400 focus:scale-[1.01] hover:shadow-md"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`w-full py-4 mt-6 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 transition-all duration-300 shadow-md transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-cyan-300
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Sign Up'}
              </button>
            </form>

            <div className="flex items-center my-6 w-full">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-400 text-sm font-semibold">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {socialLoginButtons}

            <div className="text-center text-gray-500 text-sm mt-6">
              <p>
                Already have an account?
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setFormData({ name: '', email: '', password: '', city: '' });
                    setStatusMessage({ text: '', type: '' });
                  }}
                  className="ml-1 font-semibold text-cyan-500 hover:text-cyan-400 hover:underline transition-colors duration-300"
                  disabled={isLoading}
                >
                  Sign in here
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Custom styles for the animated background elements */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }
        @keyframes float-delay-1 {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(20px) translateX(-20px);
          }
        }
        @keyframes float-delay-2 {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(-15px);
          }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite alternate;
        }
        .animate-float-delay-1 {
          animation: float-delay-1 12s ease-in-out infinite alternate;
        }
        .animate-float-delay-2 {
          animation: float-delay-2 15s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

// Main App component for rendering the Auth component directly.
const App = () => {
  return (
    <Auth />
  );
};

export default App;
