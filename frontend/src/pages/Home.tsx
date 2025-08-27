import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const roles = ['Software Engineer', 'Product Engineer', 'AI/ML Engineer', 'Cybersecurity Analyst', 'Business Analyst', 'Human Resources', 'Financial Analyst'];

const features = [
  { icon: '🎙️', title: 'Tailored Mock Interviews', desc: 'Personalized AI-powered interview experience aligned with your skills.' },
  { icon: '📄', title: 'Instant CV Screening', desc: 'Automated resume analysis with actionable feedback.' },
  { icon: '💳', title: 'Secure Credit Wallet', desc: 'Seamless payments with UPI and major gateways.' },
  { icon: '📊', title: 'Skill Persona Analytics', desc: 'Insightful skill profiles to track your progress.' },
];

const Home: React.FC = () => {
  const [typedRole, setTypedRole] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (charIndex <= roles[roleIndex].length) {
      const timeout = setTimeout(() => {
        setTypedRole(roles[roleIndex].substring(0, charIndex));
        setCharIndex(charIndex + 1);
      }, 120);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setCharIndex(0);
        setRoleIndex((roleIndex + 1) % roles.length);
      }, 1500);
      return () => clearTimeout(pause);
    }
  }, [charIndex, roleIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-teal-100 text-gray-800 font-sans flex flex-col">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-16 flex-grow">
        {/* Text Content */}
        <div className="md:flex-1">
          <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-900 leading-tight mb-6">
            Prepare for your dream job as a{' '}
            <span className="relative text-teal-600 border-b-4 border-teal-400 inline-block">
              {typedRole}
              <span className="absolute right-0 top-0 text-teal-600 font-black animate-blink">|</span>
            </span>
          </h1>
          <p className="text-lg text-indigo-800 mb-8 max-w-xl">
            Empower your career with AI-driven mock interviews, CV screenings, and dynamic skill persona building — all with easy, secure payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/auth" className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-lg transition text-center">
              Get Started
            </Link>
          </div>
        </div>

        {/* Graphic: Styled emoji big circle cards as visual cues */}
        <div className="md:flex-1 flex justify-center space-x-8">
          {roles.map((role, idx) => (
            <div
              key={role}
              className={`w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-400 to-teal-400 flex items-center justify-center text-4xl font-bold text-white transition-transform
              ${idx === roleIndex ? 'scale-110 shadow-xl' : 'opacity-60'}`}
              aria-hidden="true"
            >
              {role.split(' ')[0][0]}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-10">
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-lg shadow p-6 hover:shadow-xl transition cursor-default flex flex-col items-center text-center"
            role="group"
            aria-label={title}
          >
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-indigo-900">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 text-indigo-900 mb-20">
        <h2 className="text-4xl font-extrabold text-center mb-12">How It Works</h2>
        <ol className="list-decimal pl-8 text-lg space-y-6 max-w-3xl mx-auto">
          <li>Signup and create your profile with key details.</li>
          <li>Select your target job roles and upload CVs mapped to them.</li>
          <li>Buy interview credits securely via UPI or other payment options.</li>
          <li>Start automated mock interviews or CV screenings anytime.</li>
          <li>Receive detailed feedback and develop your unique skills persona.</li>
        </ol>
      </section>

      {/* Final Call to Action */}
      <section className="bg-gradient-to-r from-teal-600 to-indigo-700 text-white py-20 text-center">
        <h3 className="text-4xl font-extrabold mb-6">
          Ready to Take Your Career to the Next Level?
        </h3>
        <p className="max-w-xl mx-auto text-lg mb-8">
          Join thousands of students and startups succeeding with AI-powered interview preparation and screening.
        </p>
        <Link to="/auth" className="inline-block rounded-full bg-white text-indigo-700 font-bold px-16 py-4 shadow-lg hover:bg-indigo-100 transition">
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-indigo-700 font-light">
        &copy; 2025 GenAutomata Inc. All rights reserved.
      </footer>

      <style>{`
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1.2s step-start infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;