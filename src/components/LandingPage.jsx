import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import {
  ArrowRightIcon,
  ChartBarIcon,
  CogIcon,
  LockClosedIcon,
  ServerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { SignInButton, SignUpButton, SignOutButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const LandingPage = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === 'coleragone@gmail.com';
  const [preorderStatus, setPreorderStatus] = useState('');

  const handlePreOrder = async () => {
    if (!user) {
      setPreorderStatus('error');
      return;
    }

    try {
      console.log('Getting token...');
      const token = await getToken();
      console.log('Token received:', token ? 'Token exists' : 'No token');
      console.log('Using API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/api/pre-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.error || 'Failed to record pre-order');
      }

      const data = await response.json();
      console.log('Success response:', data);

      if (data.message === 'Already pre-ordered') {
        setPreorderStatus('already');
      } else {
        setPreorderStatus('success');
      }
    } catch (error) {
      console.error('Pre-order error:', error);
      console.error('User details:', {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress
      });
      setPreorderStatus('error');
    }

    setTimeout(() => setPreorderStatus(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-blue-500">AdaptiGTO</span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Advanced poker strategy powered by AI. Get personalized GTO recommendations and improve your game.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isSignedIn ? (
                    <div className="rounded-md shadow space-x-4">
                      <button
                        onClick={handlePreOrder}
                        className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Pre-order Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                      <SignInButton mode="modal">
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 md:py-4 md:text-lg md:px-10">
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Why Choose AdaptiGTO?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
              Advanced features to improve your poker game
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative p-6 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ServerIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Real-time Analysis</h3>
                    <p className="mt-2 text-base text-gray-300">
                      Get instant GTO recommendations for any poker situation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <LockClosedIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Secure Platform</h3>
                    <p className="mt-2 text-base text-gray-300">
                      Your data is protected with enterprise-grade security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative p-6 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">Customizable</h3>
                    <p className="mt-2 text-base text-gray-300">
                      Adapt the system to your playing style and preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      {isSignedIn && (
        <>
          {/* Mobile Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-2 px-4 sm:hidden z-50">
            <div className="flex justify-around items-center">
              <button
                onClick={() => navigate('/trial')}
                className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Try Demo
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </button>
              )}
              <SignOutButton>
                <button className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:block sm:fixed sm:top-0 sm:right-0 sm:p-4 z-50 bg-gray-800 bg-opacity-90">
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => navigate('/trial')}
                className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
              >
                Try Demo
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-blue-400 hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </button>
              )}
              <SignOutButton>
                <button className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </>
      )}

      {/* Status Messages */}
      {preorderStatus === 'success' && (
        <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
          <p className="text-center">Thank you for your pre-order!</p>
        </div>
      )}
      {preorderStatus === 'error' && (
        <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          <p className="text-center">Please sign in to pre-order.</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 