import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  PlayIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const CARDS = {
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
  suits: ['♠', '♥', '♦', '♣']
};

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'MP+1', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

const calculateHandStrength = (card1, card2) => {
  const rank1 = CARDS.ranks.indexOf(card1[0]);
  const rank2 = CARDS.ranks.indexOf(card2[0]);
  const suited = card1[1] === card2[1];
  
  // Pair
  if (rank1 === rank2) {
    return rank1 * 2 + 13;
  }
  
  // Suited cards
  if (suited) {
    return Math.max(rank1, rank2) + Math.min(rank1, rank2) / 14 + 5;
  }
  
  // Offsuit
  return Math.max(rank1, rank2) + Math.min(rank1, rank2) / 14;
};

const calculateBoardTexture = (flopCards) => {
  const ranks = flopCards.map(card => card[0]);
  const suits = flopCards.map(card => card[1]);
  
  // Check for flush draw
  const hasFlushDraw = suits.filter((suit, index) => 
    suits.indexOf(suit) !== index
  ).length >= 1;

  // Check for straight draw
  const rankIndices = ranks.map(rank => CARDS.ranks.indexOf(rank)).sort((a, b) => a - b);
  const hasStraitDraw = rankIndices[2] - rankIndices[0] <= 4;

  // Check for paired board
  const hasPair = ranks.filter((rank, index) => 
    ranks.indexOf(rank) !== index
  ).length >= 1;

  return {
    isWet: hasFlushDraw || hasStraitDraw || hasPair,
    hasFlushDraw,
    hasStraitDraw,
    hasPair
  };
};

const getPostflopRecommendations = (handStrength, boardTexture, position, potSize) => {
  const betSize = Math.round(potSize * 0.66); // 2/3 pot bet
  const smallBet = Math.round(potSize * 0.33); // 1/3 pot bet
  
  // Premium hand on dry board
  if (handStrength > 20 && !boardTexture.isWet) {
    return [
      { action: `Bet ${betSize}BB`, frequency: 80 },
      { action: 'Check', frequency: 20 }
    ];
  }
  
  // Strong hand on wet board
  if (handStrength > 15 && boardTexture.isWet) {
    return [
      { action: `Bet ${betSize}BB`, frequency: 70 },
      { action: `Bet ${smallBet}BB`, frequency: 20 },
      { action: 'Check', frequency: 10 }
    ];
  }
  
  // Medium strength hand
  if (handStrength > 10) {
    if (boardTexture.isWet) {
      return [
        { action: `Bet ${smallBet}BB`, frequency: 40 },
        { action: 'Check', frequency: 60 }
      ];
    } else {
      return [
        { action: `Bet ${betSize}BB`, frequency: 30 },
        { action: 'Check', frequency: 70 }
      ];
    }
  }
  
  // Weak hand
  return [
    { action: `Bet ${smallBet}BB`, frequency: 20 },
    { action: 'Check', frequency: 80 }
  ];
};

const getRecommendations = (handStrength, position, actionsBeforeHero, effectiveStack) => {
  const hasRaiseBeforeHero = actionsBeforeHero.length > 0;
  const isLatePosition = ['BTN', 'CO', 'HJ'].includes(position);
  const isSB = position === 'SB';
  const isBB = position === 'BB';

  if (hasRaiseBeforeHero) {
    // Facing a raise
    if (handStrength > 20) { // Premium hands
      return [
        { action: '3-bet to 9BB', frequency: 80 },
        { action: 'Call', frequency: 20 },
        { action: 'Fold', frequency: 0 }
      ];
    } else if (handStrength > 15) { // Strong hands
      return [
        { action: '3-bet to 9BB', frequency: 35 },
        { action: 'Call', frequency: 55 },
        { action: 'Fold', frequency: 10 }
      ];
    } else if (handStrength > 10) { // Playable hands
      return [
        { action: '3-bet to 9BB', frequency: 15 },
        { action: 'Call', frequency: 45 },
        { action: 'Fold', frequency: 40 }
      ];
    } else {
      return [
        { action: '3-bet to 9BB', frequency: 5 },
        { action: 'Call', frequency: 15 },
        { action: 'Fold', frequency: 80 }
      ];
    }
  } else {
    // No raise before
    if (isBB) {
      return [
        { action: 'Check', frequency: 100 },
      ];
    }

    if (handStrength > 15) {
      return [
        { action: 'Raise to 3BB', frequency: 100 },
      ];
    } else if (handStrength > 10) {
      if (isLatePosition) {
        return [
          { action: 'Raise to 2.5BB', frequency: 75 },
          { action: 'Fold', frequency: 25 }
        ];
      } else {
        return [
          { action: 'Raise to 3BB', frequency: 30 },
          { action: 'Fold', frequency: 70 }
        ];
      }
    } else {
      if (isLatePosition) {
        return [
          { action: 'Raise to 2.5BB', frequency: 40 },
          { action: 'Fold', frequency: 60 }
        ];
      } else {
        return [
          { action: 'Raise to 3BB', frequency: 10 },
          { action: 'Fold', frequency: 90 }
        ];
      }
    }
  }
};

const TrialSimulator = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [gamePhase, setGamePhase] = useState('preflop'); // 'preflop' or 'flop'
  const [potSize, setPotSize] = useState(0);

  const generateRandomCard = (usedCards) => {
    let card;
    do {
      const rank = CARDS.ranks[Math.floor(Math.random() * CARDS.ranks.length)];
      const suit = CARDS.suits[Math.floor(Math.random() * CARDS.suits.length)];
      card = rank + suit;
    } while (usedCards.includes(card));
    return card;
  };

  const generateHand = () => {
    setLoading(true);
    setGamePhase('preflop');
    const usedCards = [];
    
    // Generate hero's cards
    const heroCard1 = generateRandomCard(usedCards);
    usedCards.push(heroCard1);
    const heroCard2 = generateRandomCard(usedCards);
    usedCards.push(heroCard2);

    // Generate flop cards
    const flopCard1 = generateRandomCard(usedCards);
    usedCards.push(flopCard1);
    const flopCard2 = generateRandomCard(usedCards);
    usedCards.push(flopCard2);
    const flopCard3 = generateRandomCard(usedCards);
    usedCards.push(flopCard3);

    // Generate a random position for the hero
    const heroPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

    // Generate random action before hero
    const actionsBeforeHero = [];
    const positions = POSITIONS.slice(0, POSITIONS.indexOf(heroPosition));
    positions.forEach(pos => {
      const action = Math.random() < 0.7 ? 'Fold' : 'Raise 2.5BB';
      if (action !== 'Fold') {
        actionsBeforeHero.push({ position: pos, action });
      }
    });

    const effectiveStack = Math.floor(Math.random() * (200 - 80) + 80);

    const newGameState = {
      heroCards: [heroCard1, heroCard2],
      flopCards: [flopCard1, flopCard2, flopCard3],
      heroPosition,
      actionsBeforeHero,
      effectiveStack,
    };

    setGameState(newGameState);
    setPotSize(7); // Assuming 1BB SB + 2BB BB + ~4BB average preflop action

    // Calculate hand strength and get recommendations
    const handStrength = calculateHandStrength(heroCard1, heroCard2);
    
    // Simulate API call to PioSolver with a delay
    setTimeout(() => {
      const recommendations = getRecommendations(
        handStrength,
        heroPosition,
        actionsBeforeHero,
        effectiveStack
      );
      setRecommendation(recommendations);
      setLoading(false);
    }, 1500);
  };

  const proceedToFlop = () => {
    setLoading(true);
    setGamePhase('flop');
    
    const handStrength = calculateHandStrength(
      gameState.heroCards[0],
      gameState.heroCards[1]
    );
    
    const boardTexture = calculateBoardTexture(gameState.flopCards);
    
    setTimeout(() => {
      const recommendations = getPostflopRecommendations(
        handStrength,
        boardTexture,
        gameState.heroPosition,
        potSize
      );
      setRecommendation(recommendations);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AdaptiGTO Trial</h1>
          <p className="mt-2 text-sm text-gray-600">
            Try our GTO poker simulator and get instant recommendations
          </p>
        </div>

        {/* Game Controls */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={generateHand}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Deal New Hand
            </button>
            <button
              onClick={proceedToFlop}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              See Flop
            </button>
            <button
              onClick={() => {}}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Show GTO Advice
            </button>
          </div>
        </div>

        {/* Game State */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Poker Table */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Poker Table</h2>
            <div className="relative bg-green-800 rounded-lg p-4 aspect-[16/9]">
              {/* Community Cards */}
              <div className="flex justify-center space-x-2 mb-4">
                {gameState?.flopCards.map((card, index) => (
                  <div
                    key={index}
                    className="w-14 h-20 bg-white rounded-lg shadow flex items-center justify-center text-xl font-bold"
                  >
                    {card || '🂠'}
                  </div>
                ))}
              </div>

              {/* Player Cards */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {gameState?.heroCards.map((card, index) => (
                    <div
                      key={index}
                      className="w-14 h-20 bg-white rounded-lg shadow flex items-center justify-center text-xl font-bold"
                    >
                      {card || '🂠'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GTO Advice */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">GTO Analysis</h2>
            {recommendation && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Recommended Action</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{recommendation[0].action}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Win Probability</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{recommendation[0].frequency}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Explanation</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {recommendation[0].action === 'Check' ? 'This is a preflop check' : 'This is a preflop bet'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialSimulator; 