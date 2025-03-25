import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useVisitTracker } from '../hooks/useVisitTracker';

const PreOrder = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  useVisitTracker();

  const handlePreOrder = () => {
    console.log('Pre-order initiated by:', user?.primaryEmailAddress?.emailAddress);
    // Add your pre-order logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

        <div className="relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Pre-order AdaptGTO</h1>
            <p className="text-xl text-emerald-100">Be among the first to master GTO poker with AI</p>
          </div>

          <div className="bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Early Access Benefits</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-100">Lifetime access to all features</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-100">Priority support and updates</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-100">Exclusive training content</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-100">Early access to new features</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-800/30 backdrop-blur-sm border border-emerald-700/50 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Pre-order Now</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-emerald-100">Early Access Price</span>
                <span className="text-2xl font-bold text-white">$49.99</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-100">Regular Price</span>
                <span className="text-xl text-emerald-300 line-through">$99.99</span>
              </div>
              <div className="pt-4 border-t border-emerald-700/50">
                <button
                  onClick={handlePreOrder}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Secure Pre-order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrder; 