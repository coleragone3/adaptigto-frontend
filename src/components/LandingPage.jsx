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
      
      const response = await fetch('http://localhost:3001/api/pre-order', {
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative z-20 bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">AdaptiGTO</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/trial')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark"
              >
                Try AdaptiGTO Free
              </button>
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.firstName || 'Player'}!</span>
                  {isAdmin && (
                    <button
                      onClick={() => navigate('/admin')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-dark"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handlePreOrder}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                    disabled={preorderStatus === 'success'}
                  >
                    {preorderStatus === 'success' ? 'Pre-ordered!' : 'Pre-order Now'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50 border-primary">
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark">
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {preorderStatus && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg ${
          preorderStatus === 'success' ? 'bg-green-500' : 
          preorderStatus === 'already' ? 'bg-blue-500' :
          'bg-red-500'
        } text-white shadow-lg z-50 transition-opacity duration-500`}>
          {preorderStatus === 'success' 
            ? 'Thank you for pre-ordering! We\'ll notify you when AdaptiGTO launches.'
            : preorderStatus === 'already'
            ? 'You have already pre-ordered AdaptiGTO. Thank you for your support!'
            : 'Failed to record pre-order. Please try again.'}
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-primary">AdaptiGTO</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Revolutionize your poker game with adaptive AI analysis. Our platform seamlessly integrates with your existing GTO calculators to provide dynamic, personalized adjustments to your gameplay.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-4">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate('/trial')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark md:py-4 md:text-lg md:px-10"
                    >
                      Try AdaptiGTO Free
                    </button>
                  </div>
                  {isSignedIn ? (
                    <div className="rounded-md shadow">
                      <button
                        onClick={handlePreOrder}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
                        disabled={preorderStatus === 'success'}
                      >
                        {preorderStatus === 'success' ? 'Pre-ordered!' : 'Pre-order Now'}
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-md shadow">
                      <SignUpButton mode="modal">
                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10">
                          Get Started
                          <ArrowRightIcon className="ml-2 h-5 w-5" />
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
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-secondary font-semibold tracking-wide uppercase">Advanced Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Next-Level Poker Analysis
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="mt-2 ml-10 text-base text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to elevate your poker game?</span>
            <span className="block text-indigo-200">Pre-order AdaptiGTO today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              {isSignedIn ? (
                <button
                  onClick={handlePreOrder}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50"
                  disabled={preorderStatus === 'success'}
                >
                  {preorderStatus === 'success' ? 'Pre-ordered!' : 'Pre-order Now'}
                </button>
              ) : (
                <SignUpButton mode="modal">
                  <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50">
                    Get Started
                  </button>
                </SignUpButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    name: 'Real-Time GTO Integration',
    description: 'Seamlessly connects with your existing GTO calculators for instant analysis and adjustments during gameplay.',
    icon: <ServerIcon className="h-6 w-6 text-secondary" />
  },
  {
    name: 'Dynamic Performance Analytics',
    description: 'Advanced AI algorithms analyze your play patterns and suggest optimal adjustments in real-time.',
    icon: <ChartBarIcon className="h-6 w-6 text-secondary" />
  },
  {
    name: 'Instant Feedback',
    description: 'Receive immediate insights and recommendations to improve your decision-making process.',
    icon: <LockClosedIcon className="h-6 w-6 text-secondary" />
  },
  {
    name: 'Adaptive Learning',
    description: 'Our AI continuously learns from your gameplay, providing increasingly personalized strategic advice.',
    icon: <CogIcon className="h-6 w-6 text-secondary" />
  },
];

export default LandingPage; 