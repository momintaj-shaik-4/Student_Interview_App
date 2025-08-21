import React from 'react';
import { FaGoogle, FaLinkedin, FaMicrosoft } from 'react-icons/fa';

const SocialLoginButtons = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/google';
  };

  const handleLinkedInLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/linkedin';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/api/v1/auth/microsoft';
  };

  return (
    <div className="space-y-3">
      <h3 className="text-center text-sm font-medium text-gray-400">or continue with</h3>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FaGoogle className="mr-2" /> Login with Google
      </button>
      <button
        onClick={handleLinkedInLogin}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
      >
        <FaLinkedin className="mr-2" /> Login with LinkedIn
      </button>
      <button
        onClick={handleMicrosoftLogin}
        className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <FaMicrosoft className="mr-2" /> Login with Microsoft
      </button>
    </div>
  );
};

export default SocialLoginButtons;