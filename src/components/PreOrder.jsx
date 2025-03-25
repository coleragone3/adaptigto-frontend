import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useVisitTracker } from '../hooks/useVisitTracker';

const PreOrder = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  useVisitTracker();

  const handlePreOrder = (tier) => {
    console.log('Pre-order initiated by:', user?.primaryEmailAddress?.emailAddress, 'for tier:', tier);
    // Add your pre-order logic here
  };

  const tiers = [
    {
      name: 'Basic',
      price: 29.99,
      originalPrice: 49.99,
      description: 'Perfect for beginners',
      features: [
        'Basic GTO calculator',
        'Hand history analysis',
        'Basic strategy recommendations',
        'Community support',
        'Web-based access'
      ],
      highlight: false
    },
    {
      name: 'Pro',
      price: 79.99,
      originalPrice: 149.99,
      description: 'Most popular for serious players',
      features: [
        'Advanced GTO calculator',
        'Real-time HUD integration',
        'AI-powered analysis',
        'Custom strategy builder',
        'Priority support',
        'Desktop application',
        'Hand history tracking',
        'Multi-table support'
      ],
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 199.99,
      originalPrice: 299.99,
      description: 'For professional players and teams',
      features: [
        'Everything in Pro',
        'Team management tools',
        'Custom AI model training',
        'API access',
        'Dedicated support',
        'Advanced analytics',
        'Custom integrations',
        'White-label options'
      ],
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
            <p className="text-xl text-emerald-100">Choose the perfect plan for your poker journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl p-8 ${
                  tier.highlight
                    ? 'bg-emerald-800/50 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : 'bg-emerald-800/30 border border-emerald-700/50'
                } backdrop-blur-sm`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Best Value
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{tier.name}</h2>
                  <p className="text-emerald-100 mb-4">{tier.description}</p>
                  <div className="flex justify-center items-baseline">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                    <span className="text-xl text-emerald-300 line-through ml-2">${tier.originalPrice}</span>
                  </div>
                  <p className="text-sm text-emerald-300 mt-2">One-time payment, lifetime access</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-emerald-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePreOrder(tier.name)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    tier.highlight
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-emerald-800/50 hover:bg-emerald-800/70 text-emerald-400 border border-emerald-700/50'
                  }`}
                >
                  Pre-order {tier.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-emerald-100 text-sm">
              All plans include 30-day money-back guarantee and lifetime updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrder; 