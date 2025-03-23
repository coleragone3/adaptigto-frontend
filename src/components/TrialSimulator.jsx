import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const CARDS = {
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
  suits: ['♠', '♥', '♦', '♣']
};

const POSITIONS = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];

const TrialSimulator = () => {
  const { user } = useUser();
  const [showGTO, setShowGTO] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [phase, setPhase] = useState('preflop'); // 'preflop' or 'postflop'

  const generateRandomCard = (usedCards = []) => {
    let card;
    do {
      const rank = CARDS.ranks[Math.floor(Math.random() * CARDS.ranks.length)];
      const suit = CARDS.suits[Math.floor(Math.random() * CARDS.suits.length)];
      card = { rank, suit };
    } while (usedCards.some(c => c.rank === card.rank && c.suit === card.suit));
    return card;
  };

  const dealNewHand = () => {
    const usedCards = [];
    // Generate hero's cards
    const card1 = generateRandomCard(usedCards);
    usedCards.push(card1);
    const card2 = generateRandomCard(usedCards);
    usedCards.push(card2);

    // Generate flop
    const flop1 = generateRandomCard(usedCards);
    usedCards.push(flop1);
    const flop2 = generateRandomCard(usedCards);
    usedCards.push(flop2);
    const flop3 = generateRandomCard(usedCards);
    usedCards.push(flop3);

    setGameState({
      heroCards: [card1, card2],
      flopCards: [flop1, flop2, flop3],
      potSize: 3 // Starting pot size in BB
    });
    setPhase('preflop');
    setSelectedPosition(null);
    setShowGTO(false);
  };

  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-400' : 'text-gray-100';
  };

  const calculateGTOStrategy = (cards, position, phase, potSize) => {
    // Simple GTO strategy calculation
    const handStrength = CARDS.ranks.indexOf(cards[0].rank) + CARDS.ranks.indexOf(cards[1].rank) / 13;
    const isSuited = cards[0].suit === cards[1].suit;
    const isPair = cards[0].rank === cards[1].rank;
    
    if (phase === 'preflop') {
      if (isPair || (handStrength > 20) || (isSuited && handStrength > 18)) {
        return { raise: 85, fold: 15 };
      } else if (handStrength > 15) {
        return { raise: 65, fold: 35 };
      } else {
        return { raise: 25, fold: 75 };
      }
    } else {
      // Postflop strategy
      if (handStrength > 20) {
        return { bet: 60, check: 35, fold: 5 };
      } else if (handStrength > 15) {
        return { bet: 40, check: 50, fold: 10 };
      } else {
        return { bet: 20, check: 50, fold: 30 };
      }
    }
  };

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

        <div className="mb-8 flex justify-center">
          <button
            onClick={dealNewHand}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Deal New Hand
          </button>
        </div>

        {gameState && (
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
                      {gameState.heroCards.map((card, index) => (
                        <div key={index} className="bg-gray-600 p-3 rounded text-center">
                          <span className={`text-2xl ${getCardColor(card.suit)}`}>
                            {card.rank}{card.suit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">Position</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {POSITIONS.map(pos => (
                        <button
                          key={pos}
                          onClick={() => setSelectedPosition(pos)}
                          className={`${
                            selectedPosition === pos
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-600 hover:bg-gray-700'
                          } text-white px-3 py-2 rounded transition-colors`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">Action</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setShowGTO(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Raise 2.5BB
                      </button>
                      <button 
                        onClick={() => setShowGTO(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Fold
                      </button>
                    </div>
                  </div>

                  {showGTO && selectedPosition && (
                    <div className="bg-indigo-900 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">GTO Analysis</h4>
                      <p className="text-gray-300">
                        {(() => {
                          const strategy = calculateGTOStrategy(gameState.heroCards, selectedPosition, 'preflop');
                          return `Raise 2.5BB (${strategy.raise}%) | Fold (${strategy.fold}%)`;
                        })()}
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
                      {gameState.flopCards.map((card, index) => (
                        <div key={index} className="bg-gray-600 p-3 rounded text-center">
                          <span className={`text-2xl ${getCardColor(card.suit)}`}>
                            {card.rank}{card.suit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">Pot Size: {gameState.potSize}BB</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => {
                          setPhase('postflop');
                          setShowGTO(true);
                        }}
                        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                      >
                        Bet {Math.round(gameState.potSize * 0.66)}BB
                      </button>
                      <button 
                        onClick={() => {
                          setPhase('postflop');
                          setShowGTO(true);
                        }}
                        className="bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-700"
                      >
                        Check
                      </button>
                      <button 
                        onClick={() => {
                          setPhase('postflop');
                          setShowGTO(true);
                        }}
                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                      >
                        Fold
                      </button>
                    </div>
                  </div>

                  {showGTO && phase === 'postflop' && selectedPosition && (
                    <div className="bg-indigo-900 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">GTO Analysis</h4>
                      <p className="text-gray-300">
                        {(() => {
                          const strategy = calculateGTOStrategy(gameState.heroCards, selectedPosition, 'postflop', gameState.potSize);
                          return `Bet ${Math.round(gameState.potSize * 0.66)}BB (${strategy.bet}%) | Check (${strategy.check}%) | Fold (${strategy.fold}%)`;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {!gameState && (
          <div className="text-center text-gray-300 text-lg">
            Click "Deal New Hand" to start practicing!
          </div>
        )}

        {gameState && (
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
        )}
      </div>
    </div>
  );
};

export default TrialSimulator; 