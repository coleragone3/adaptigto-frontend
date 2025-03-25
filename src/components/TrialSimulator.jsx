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
  const [showFlop, setShowFlop] = useState(false);
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

    // Generate flop
    const flop1 = generateRandomCard(usedCards);
    usedCards.push(flop1);
    const flop2 = generateRandomCard(usedCards);
    usedCards.push(flop2);
    const flop3 = generateRandomCard(usedCards);
    usedCards.push(flop3);

    // Randomly select position
    const randomPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];

    // Randomly select a position that raised before us
    const possibleRaisers = POSITIONS.slice(0, POSITIONS.indexOf(randomPosition));
    const raiser = possibleRaisers.length > 0 ? 
      possibleRaisers[Math.floor(Math.random() * possibleRaisers.length)] : 
      null;

    setGameState({
      heroCards: [card1, card2],
      flopCards: [flop1, flop2, flop3],
      potSize: 3,
      players: POSITIONS.map(pos => ({
        position: pos,
        stack: Math.floor(Math.random() * (200 - 80) + 80),
        hasCards: true
      }))
    });
    setSelectedPosition(randomPosition);
    setRaisePosition(raiser);
    setShowFlop(false);
  };

  const getCardColor = (suit) => {
    return suit === '♥' || suit === '♦' ? 'text-red-600' : 'text-black';
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

  const renderPokerTable = () => {
    if (!gameState) return null;

    // Calculate evenly spaced positions around the table
    const seatPositions = {
      'UTG': 'top-[20%] left-[15%]',
      'UTG+1': 'top-[10%] left-[30%]',
      'MP': 'top-[8%] left-[48%]',
      'MP+1': 'top-[10%] right-[30%]',
      'HJ': 'top-[20%] right-[15%]',
      'CO': 'bottom-[20%] right-[15%]',
      'BTN': 'bottom-[10%] right-[30%]',
      'SB': 'bottom-[8%] left-[48%]',
      'BB': 'bottom-[20%] left-[15%]'
    };

    // Position cards in front of seats
    const cardPositions = {
      'UTG': 'top-[120%] left-1/2',
      'UTG+1': 'top-[120%] left-1/2',
      'MP': 'top-[120%] left-1/2',
      'MP+1': 'top-[120%] left-1/2',
      'HJ': 'top-[120%] left-1/2',
      'CO': 'top-[120%] left-1/2',
      'BTN': 'top-[120%] left-1/2',
      'SB': 'top-[120%] left-1/2',
      'BB': 'top-[120%] left-1/2'
    };

    // Inner circle for chip placement - adjusted for better visual flow
    const chipPositions = {
      'UTG': 'top-[45%] left-[30%]',
      'UTG+1': 'top-[35%] left-[42%]',
      'MP': 'top-[32%] left-[48%]',
      'MP+1': 'top-[35%] right-[42%]',
      'HJ': 'top-[45%] right-[30%]',
      'CO': 'bottom-[45%] right-[30%]',
      'BTN': 'bottom-[35%] right-[42%]',
      'SB': 'bottom-[32%] left-[48%]',
      'BB': 'bottom-[45%] left-[30%]'
    };

    // Calculate total pot including blinds and raises
    const calculatePotAndChips = () => {
      let chips = {};
      // Add small blind
      chips['SB'] = { 
        amount: 0.5, 
        type: 'sb', 
        stacks: [
          { value: 0.5, color: 'bg-yellow-400', size: 'w-8 h-8' }
        ] 
      };
      // Add big blind
      chips['BB'] = { 
        amount: 1, 
        type: 'bb', 
        stacks: [
          { value: 1, color: 'bg-yellow-500', size: 'w-8 h-8' }
        ] 
      };
      
      // Add raise if exists
      if (raisePosition) {
        chips[raisePosition] = { 
          amount: 3, 
          type: 'raise',
          stacks: [
            { value: 1, color: 'bg-yellow-500', size: 'w-8 h-8' },
            { value: 1, color: 'bg-yellow-500', size: 'w-7 h-7' },
            { value: 1, color: 'bg-yellow-500', size: 'w-6 h-6' }
          ]
        };
      }

      return chips;
    };

    const chips = calculatePotAndChips();

    return (
      <div className="relative w-full max-w-4xl h-[340px] mx-auto mb-8">
        {/* Table felt */}
        <div className="absolute inset-0 bg-emerald-600 rounded-[45%] shadow-2xl">
          {/* Table padding */}
          <div className="absolute inset-4 bg-emerald-700 rounded-[45%] border-2 border-emerald-800">
            {/* Center/Community Cards */}
            {showFlop && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
                {gameState.flopCards.map((card, index) => (
                  <div key={index} className="w-10 h-14 bg-white rounded-lg shadow-xl flex items-center justify-center">
                    <span className={`text-xl ${getCardColor(card.suit)}`}>
                      {card.rank}{card.suit}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Pot Size - Stacked Chips */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-12 h-12">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-12 h-12 rounded-full bg-yellow-500 border-2 border-yellow-600 shadow-xl
                      ${i === 0 ? '-top-2' : i === 1 ? 'top-0' : 'top-2'}`}
                  />
                ))}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">
                  {gameState.potSize}BB
                </div>
              </div>
            </div>

            {/* Player Seats */}
            {gameState.players.map((player) => (
              <div
                key={player.position}
                className={`absolute ${seatPositions[player.position]}`}
              >
                {/* Player position circle */}
                <div className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center ${
                  player.position === selectedPosition ? 'bg-blue-600' : 'bg-slate-700'
                } border-2 ${player.position === selectedPosition ? 'border-blue-400' : 'border-slate-600'} shadow-lg`}>
                  <div className="text-white font-bold text-sm">{player.position}</div>
                  <div className="text-white text-xs">{player.stack} BB</div>

                  {/* Cards in front of position */}
                  {player.position === selectedPosition && (
                    <div className={`absolute ${cardPositions[player.position]} transform -translate-x-1/2 flex gap-1 z-10`}>
                      {gameState.heroCards.map((card, idx) => (
                        <div key={idx} className="w-8 h-12 bg-white rounded-sm flex items-center justify-center shadow-xl">
                          <span className={`text-base ${getCardColor(card.suit)}`}>
                            {card.rank}{card.suit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chips on the felt */}
                {chips[player.position] && (
                  <div className={`absolute ${chipPositions[player.position]} flex items-center justify-center`}>
                    <div className="relative">
                      {chips[player.position].stacks.map((chip, i) => (
                        <div
                          key={i}
                          className={`absolute ${chip.size} rounded-full ${chip.color} border border-yellow-600 shadow-lg flex items-center justify-center text-white font-bold text-xs
                            ${i === 0 ? 'top-0 z-30' : i === 1 ? '-top-1 z-20' : '-top-2 z-10'}`}
                        >
                          {i === 0 && chip.value + 'BB'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderGTOBarChart = () => {
    if (!gameState) return null;

    const strategy = calculateGTOStrategy(
      gameState.heroCards,
      selectedPosition,
      gameState.players.find(p => p.position === selectedPosition)?.stack
    );

    return (
      <div className="bg-white rounded-xl shadow-xl p-6 mt-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-6">GTO Preflop Strategy</h4>
        <div className="space-y-4">
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700">Raise</div>
              <div className="text-sm font-semibold text-gray-900">{strategy.raise}%</div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
              <div
                style={{ width: `${strategy.raise}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
              />
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700">Call</div>
              <div className="text-sm font-semibold text-gray-900">{strategy.call}%</div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
              <div
                style={{ width: `${strategy.call}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
              />
            </div>
          </div>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700">Fold</div>
              <div className="text-sm font-semibold text-gray-900">{strategy.fold}%</div>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
              <div
                style={{ width: `${strategy.fold}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            ← Back to Home
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Poker Table Simulator
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience real-time GTO analysis in a familiar table setting. Practice optimal preflop decisions with instant feedback.
          </p>
        </div>

        {renderPokerTable()}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderGTOBarChart()}
          <div className="bg-white rounded-xl shadow-xl p-6 mt-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Position Info</h4>
            <p className="text-gray-600">
              You are in position {selectedPosition} with {gameState?.players.find(p => p.position === selectedPosition)?.stack}BB.
              {raisePosition && ` There was a raise from ${raisePosition}.`}
            </p>
          </div>
        </div>

        <div className="fixed bottom-8 right-8 space-x-4">
          {gameState && (
            <button
              onClick={() => setShowFlop(!showFlop)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 shadow-lg"
            >
              {showFlop ? 'Hide Flop' : 'Show Flop'}
            </button>
          )}
          <button
            onClick={dealNewHand}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-lg"
          >
            Deal New Hand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialSimulator; 