import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { useVisitTracker } from '../hooks/useVisitTracker';

const LandingPage = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  useVisitTracker();

  const handleSignOut = async () => {
    await user.delete();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-emerald-900/80 backdrop-blur-sm border-b border-emerald-700/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-semibold text-white">
                AdaptGTO
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <>
                  <Link
                    to="/trial"
                    className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Try Demo
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  {user.primaryEmailAddress.emailAddress === 'coleragone@gmail.com' && (
                    <Link
                      to="/admin"
                      className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 blur-3xl opacity-20">
            <svg viewBox="0 0 1108 632" aria-hidden="true" className="w-[69.25rem] max-w-none">
              <path
                fill="url(#gradient)"
                d="M235.233 402.609 57.541 321.573.83 631.05l234.404-228.441 320.018 145.945c-65.036-115.261-134.286-322.756 109.01-230.655C968.382 433.026 1031 651.247 1092.23 459.36c48.98-153.51-34.51-321.107-82.37-385.717L810.952 324.222 648.261.088 235.233 402.609Z"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="1220.59"
                  x2="-85.053"
                  y1="432.766"
                  y2="638.714"
                >
                  <stop stopColor="#4ade80" />
                  <stop offset=".5" stopColor="#22c55e" />
                  <stop offset="1" stopColor="#15803d" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Master GTO Poker
              <span className="block text-emerald-400">with AI-Powered Analysis</span>
            </h1>
            <p className="mt-6 text-xl text-emerald-100 max-w-3xl mx-auto">
              Get instant feedback on your decisions and learn optimal strategies for every situation.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/trial"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-emerald-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg shadow-emerald-900/30"
              >
                Try Demo
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center px-6 py-3 border border-emerald-400 text-base font-medium rounded-lg text-emerald-400 bg-transparent hover:bg-emerald-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Poker Chip Decoration */}
            <div className="absolute -top-16 -right-16 w-32 h-32 blur-sm opacity-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="url(#chip-gradient)" />
                <circle cx="50" cy="50" r="42" stroke="#fff" strokeWidth="1" fill="none" />
                <defs>
                  <linearGradient id="chip-gradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Feature Cards */}
            <div className="p-6 rounded-xl bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/50">
              <div className="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Analysis</h3>
              <p className="text-emerald-200">Get instant feedback on your decisions with our advanced AI analysis.</p>
            </div>

            <div className="p-6 rounded-xl bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/50">
              <div className="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GTO Strategy</h3>
              <p className="text-emerald-200">Learn optimal strategies for every position and situation.</p>
            </div>

            <div className="p-6 rounded-xl bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/50">
              <div className="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Learning</h3>
              <p className="text-emerald-200">Practice with our interactive simulator and track your progress.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-emerald-900/50 border-t border-emerald-800/50 mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-emerald-400 text-sm">
            © {new Date().getFullYear()} AdaptGTO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 