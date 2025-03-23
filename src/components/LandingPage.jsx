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
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-blue-600">AdaptiGTO</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Advanced poker strategy powered by AI. Get personalized GTO recommendations and improve your game.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isSignedIn ? (
                    <div className="rounded-md shadow">
                      <button
                        onClick={handlePreOrder}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
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
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
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
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose AdaptiGTO?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Advanced features to improve your poker game
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ServerIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Real-time Analysis</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Get instant GTO recommendations for any poker situation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <LockClosedIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Secure Platform</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Your data is protected with enterprise-grade security.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <CogIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Customizable</h3>
                    <p className="mt-2 text-base text-gray-500">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 sm:hidden">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/trial')}
            className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            Try Demo
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:fixed sm:top-0 sm:right-0 sm:p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/trial')}
            className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            Try Demo
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {preorderStatus === 'success' && (
        <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="text-center">Thank you for your pre-order!</p>
        </div>
      )}
      {preorderStatus === 'error' && (
        <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-center">Please sign in to pre-order.</p>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 