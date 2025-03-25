import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useVisitTracker } from '../hooks/useVisitTracker';

const CARDS = {
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
  suits: ['♠', '♥', '♦', '♣']
};

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'MP+1', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

const TrialSimulator = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  useVisitTracker();
  const [gameState, setGameState] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState('BTN');
  const [raisePosition, setRaisePosition] = useState(null);

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

    // Randomly select position
    const randomPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

    // Randomly select a position that raised before us
    const possibleRaisers = POSITIONS.slice(0, POSITIONS.indexOf(randomPosition));
    const raiser = possibleRaisers.length > 0 ? 
      possibleRaisers[Math.floor(Math.random() * possibleRaisers.length)] : 
      null;

    setGameState({
      heroCards: [card1, card2],
      potSize: raiser ? 3 : 1.5,
      position: randomPosition,
      stack: Math.floor(Math.random() * (200 - 80) + 80)
    });
    setSelectedPosition(randomPosition);
    setRaisePosition(raiser);
  };

  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-gray-900';
  };

  const calculateGTOStrategy = (cards, position, stack) => {
    const handStrength = CARDS.ranks.indexOf(cards[0].rank) + CARDS.ranks.indexOf(cards[1].rank) / 13;
    const isSuited = cards[0].suit === cards[1].suit;
    const isPair = cards[0].rank === cards[1].rank;
    
    if (position === 'BTN' || position === 'CO') {
      if (isPair || (handStrength > 20) || (isSuited && handStrength > 18)) {
        return { raise: 85, call: 10, fold: 5 };
      } else if (handStrength > 15) {
        return { raise: 65, call: 20, fold: 15 };
      } else {
        return { raise: 40, call: 20, fold: 40 };
      }
    } else if (position === 'SB') {
      if (isPair || (handStrength > 20)) {
        return { raise: 80, call: 15, fold: 5 };
      } else {
        return { raise: 30, call: 20, fold: 50 };
      }
    } else if (position === 'BB') {
      if (isPair || handStrength > 18) {
        return { raise: 70, call: 25, fold: 5 };
      } else {
        return { raise: 25, call: 45, fold: 30 };
      }
    } else {
      // Early position
      if (isPair || handStrength > 22) {
        return { raise: 90, call: 5, fold: 5 };
      } else if (handStrength > 19) {
        return { raise: 60, call: 10, fold: 30 };
      } else {
        return { raise: 15, call: 15, fold: 70 };
      }
    }
  };

  const renderHand = () => {
    if (!gameState) return null;

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Cards */}
          <div className="flex gap-4">
            {gameState.heroCards.map((card, idx) => (
              <div key={idx} className="w-20 h-32 bg-white rounded-xl border-2 border-gray-200 shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                <span className={`text-4xl font-bold ${getCardColor(card.suit)}`}>
                  {card.rank}{card.suit}
                </span>
              </div>
            ))}
          </div>
          
          {/* Game Info */}
          <div className="text-center space-y-2">
            <div className="text-lg font-medium text-gray-900">
              Position: <span className="text-blue-600">{gameState.position}</span>
            </div>
            <div className="text-gray-600">
              Stack: {gameState.stack} BB
              {raisePosition && <span className="ml-2">• Raise from {raisePosition}</span>}
            </div>
            <div className="text-gray-600">
              Pot: {gameState.potSize} BB
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGTOStrategy = () => {
    if (!gameState) return null;

    const strategy = calculateGTOStrategy(
      gameState.heroCards,
      selectedPosition,
      gameState.stack
    );

    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">GTO Preflop Strategy</h3>
        <div className="space-y-6">
          {/* Raise Action */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Raise</span>
              <span className="text-sm font-semibold text-gray-900">{strategy.raise}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${strategy.raise}%` }}
              />
            </div>
          </div>

          {/* Call Action */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Call</span>
              <span className="text-sm font-semibold text-gray-900">{strategy.call}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${strategy.call}%` }}
              />
            </div>
          </div>

          {/* Fold Action */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Fold</span>
              <span className="text-sm font-semibold text-gray-900">{strategy.fold}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${strategy.fold}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
          <button
            onClick={dealNewHand}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
          >
            Deal New Hand
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GTO Trainer
          </h1>
          <p className="text-xl text-gray-600">
            Practice optimal preflop decisions with instant GTO analysis
          </p>
        </div>

        {gameState ? (
          <div className="space-y-8">
            {renderHand()}
            {renderGTOStrategy()}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Click "Deal New Hand" to start practicing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialSimulator; 