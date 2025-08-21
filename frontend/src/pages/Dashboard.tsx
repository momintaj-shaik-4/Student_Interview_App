import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the User interface to specify the expected properties
interface UserProfile {
  name: string;
  email: string;
}

const Dashboard = () => {
  // Use the UserProfile type to initialize your user state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        // Now TypeScript knows that response.data matches the UserProfile type
        setUser(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail || "Failed to fetch profile.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-white text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h2>
        {/* Use optional chaining to safely access properties in case user is null */}
        {user && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;