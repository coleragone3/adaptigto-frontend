import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const TrialSimulator = () => {
  const { user } = useUser();
  const [showGTO, setShowGTO] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Try AdaptGTO
          </h2>
          <p className="mt-3 text-xl text-gray-300">
            Experience the power of adaptive GTO poker strategy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preflop Section */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Preflop Trainer</h3>
              <p className="text-gray-300 mb-6">
                Master preflop decisions with real-time GTO analysis
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Your Hand</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-600 p-3 rounded text-center">
                      <span className="text-red-400 text-2xl">A♥</span>
                    </div>
                    <div className="bg-gray-600 p-3 rounded text-center">
                      <span className="text-red-400 text-2xl">K♥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Position</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
                      BTN
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
                      SB
                    </button>
                    <button className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700">
                      BB
                    </button>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Action</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      Raise 2.5BB
                    </button>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Fold
                    </button>
                  </div>
                </div>

                {showGTO && (
                  <div className="bg-indigo-900 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">GTO Analysis</h4>
                    <p className="text-gray-300">
                      Raise 2.5BB (85%) | Fold (15%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Postflop Section */}
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Postflop Trainer</h3>
              <p className="text-gray-300 mb-6">
                Perfect your postflop strategy with dynamic GTO solutions
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Board</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-600 p-3 rounded text-center">
                      <span className="text-red-400 text-2xl">J♥</span>
                    </div>
                    <div className="bg-gray-600 p-3 rounded text-center">
                      <span className="text-black text-2xl">T♠</span>
                    </div>
                    <div className="bg-gray-600 p-3 rounded text-center">
                      <span className="text-red-400 text-2xl">8♥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-2">Pot Size: 100BB</h4>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                      Bet 50BB
                    </button>
                    <button className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700">
                      Check
                    </button>
                    <button className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
                      Fold
                    </button>
                  </div>
                </div>

                {showGTO && (
                  <div className="bg-indigo-900 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">GTO Analysis</h4>
                    <p className="text-gray-300">
                      Bet 50BB (60%) | Check (35%) | Fold (5%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => setShowGTO(!showGTO)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showGTO ? 'Hide GTO Analysis' : 'Show GTO Analysis'}
          </button>
          {!user && (
            <a
              href="/sign-up"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign Up for Full Access
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialSimulator; 