import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useVisitTracker } from '../hooks/useVisitTracker';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const TrialSimulator = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  useVisitTracker();
  const [gameState, setGameState] = useState({
    pot: 100,
    stack: 1000,
    position: 'BTN',
    hand: 'AKs',
    board: '2h 7d Kc',
    action: '3bet',
    villainRange: 'UTG',
    villainAction: '4bet'
  });
  const [gtoStrategy, setGtoStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/calculate-gto-strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameState)
      });

      if (response.ok) {
        const data = await response.json();
        setGtoStrategy(data);
      } else {
        setError('Failed to calculate GTO strategy');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">GTO Trial Simulator</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Game State */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <h2 className="text-xl font-semibold text-white mb-6">Game State</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Pot Size</label>
                  <input
                    type="number"
                    value={gameState.pot}
                    onChange={(e) => setGameState({ ...gameState, pot: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Stack Size</label>
                  <input
                    type="number"
                    value={gameState.stack}
                    onChange={(e) => setGameState({ ...gameState, stack: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Position</label>
                  <select
                    value={gameState.position}
                    onChange={(e) => setGameState({ ...gameState, position: e.target.value })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="UTG">UTG</option>
                    <option value="MP">MP</option>
                    <option value="CO">CO</option>
                    <option value="BTN">BTN</option>
                    <option value="SB">SB</option>
                    <option value="BB">BB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Hand</label>
                  <input
                    type="text"
                    value={gameState.hand}
                    onChange={(e) => setGameState({ ...gameState, hand: e.target.value })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Board</label>
                  <input
                    type="text"
                    value={gameState.board}
                    onChange={(e) => setGameState({ ...gameState, board: e.target.value })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Action</label>
                  <select
                    value={gameState.action}
                    onChange={(e) => setGameState({ ...gameState, action: e.target.value })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="3bet">3bet</option>
                    <option value="call">Call</option>
                    <option value="fold">Fold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Villain Range</label>
                  <select
                    value={gameState.villainRange}
                    onChange={(e) => setGameState({ ...gameState, villainRange: e.target.value })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="UTG">UTG</option>
                    <option value="MP">MP</option>
                    <option value="CO">CO</option>
                    <option value="BTN">BTN</option>
                    <option value="SB">SB</option>
                    <option value="BB">BB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-300 mb-1">Villain Action</label>
                  <select
                    value={gameState.villainAction}
                    onChange={(e) => setGameState({ ...gameState, villainAction: e.target.value })}
                    className="w-full bg-gray-700 border border-emerald-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="4bet">4bet</option>
                    <option value="call">Call</option>
                    <option value="fold">Fold</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating...
                  </>
                ) : (
                  'Calculate GTO Strategy'
                )}
              </button>
            </div>

            {/* Right Column: GTO Strategy */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
              <h2 className="text-xl font-semibold text-white mb-6">GTO Strategy</h2>
              
              {error ? (
                <div className="text-red-400 bg-red-900/30 p-4 rounded-lg">
                  {error}
                </div>
              ) : gtoStrategy ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-emerald-300 mb-2">3bet</h3>
                      <p className="text-2xl font-bold text-white">{gtoStrategy.threebet}%</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-emerald-300 mb-2">Call</h3>
                      <p className="text-2xl font-bold text-white">{gtoStrategy.call}%</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-emerald-300 mb-2">Fold</h3>
                      <p className="text-2xl font-bold text-white">{gtoStrategy.fold}%</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-emerald-300 mb-2">EV</h3>
                      <p className="text-2xl font-bold text-white">{gtoStrategy.ev}</p>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-emerald-300 mb-2">Strategy Explanation</h3>
                    <p className="text-white">{gtoStrategy.explanation}</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  Enter game state and click "Calculate GTO Strategy" to see the optimal play
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialSimulator; 