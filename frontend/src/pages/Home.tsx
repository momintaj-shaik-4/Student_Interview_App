import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 text-center">
      <div className="flex flex-col items-center max-w-4xl w-full">
        {/* Main Title and Subtitle */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
          Automate Your Interviews, Master Your Hiring
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl animate-slideInUp">
          Streamline your hiring process with AI-powered screening, automated interviews, and insightful assessment reports for students and startups.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
          <Link
            to="/auth"
            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-transform duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Learn More
          </a>
        </div>

        {/* Features Section */}
        <div id="features" className="w-full">
          <h2 className="text-3xl font-bold mb-8 text-indigo-400">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-2">CV Screening</h3>
              <p className="text-gray-400">
                Instantly screen resumes and shortlist candidates based on specific job roles and requirements.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Automated Interviews</h3>
              <p className="text-gray-400">
                Conduct interviews 24/7 with our AI bot using a secure twin-factor authentication process.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
              <h3 className="text-xl font-bold mb-2">Assessment Reports</h3>
              <p className="text-gray-400">
                Receive detailed, data-driven reports to make informed hiring decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;