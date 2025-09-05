import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Updated interface to match the actual API response
interface UserProfile {
  name: string;
  email: string;
  id?: string;
  city?: string;
  // Note: password should never be returned by the API, but adding it just in case
  password?: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log("Came to dashboard")
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      console.log(token)

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
        
        // Log the response to debug
        console.log('API Response:', response.data);
        console.log('Name field type:', typeof response.data.name);
        console.log('Name field value:', response.data.name);
        
        // Handle the case where name might be an object
        let userName = 'N/A';
        if (typeof response.data.name === 'string') {
          userName = response.data.name;
        } else if (typeof response.data.name === 'object' && response.data.name !== null) {
          // If name is an object, try to extract meaningful data
          userName = response.data.name.first_name || response.data.name.firstName || 
                   response.data.name.full_name || response.data.name.fullName ||
                   response.data.name.name || JSON.stringify(response.data.name);
        }
        
        // Ensure we're only setting the expected user data
        const userData: UserProfile = {
          name: userName,
          email: response.data.email || 'N/A',
          id: response.data.id,
          city: response.data.city
        };
        
        setUser(userData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-red-500 text-center text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h2>
        {user && (
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.city && <p><strong>City:</strong> {user.city}</p>}
            {user.id && <p><strong>ID:</strong> {user.id}</p>}
          </div>
        )}
        <div className="mt-6">
          <button 
            onClick={() => {
              localStorage.removeItem('access_token');
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;