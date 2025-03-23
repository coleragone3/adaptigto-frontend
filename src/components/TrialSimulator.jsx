import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const CARDS = {
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'],
  suits: ['♠', '♥', '♦', '♣']
};

const POSITIONS = ['UTG', 'UTG+1', 'MP', 'MP+1', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

const TrialSimulator = () => {
  const { user } = useUser();
  const navigate = useNavigate();
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

    const seatPositions = {
      'UTG': 'top-[20%] left-[10%]',
      'UTG+1': 'top-[8%] left-[25%]',
      'MP': 'top-[3%] left-[40%]',
      'MP+1': 'top-[3%] right-[40%]',
      'HJ': 'top-[8%] right-[25%]',
      'CO': 'top-[20%] right-[10%]',
      'BTN': 'bottom-[20%] right-[10%]',
      'SB': 'bottom-[8%] right-[25%]',
      'BB': 'bottom-[3%] right-[40%]'
    };

    const cardPositions = {
      'UTG': '-top-16 left-1/2',
      'UTG+1': '-top-16 left-1/2',
      'MP': '-top-16 left-1/2',
      'MP+1': '-top-16 left-1/2',
      'HJ': '-top-16 left-1/2',
      'CO': '-top-16 left-1/2',
      'BTN': '-top-16 left-1/2',
      'SB': '-top-16 left-1/2',
      'BB': '-top-16 left-1/2'
    };

    const chipPositions = {
      'UTG': 'top-[45%] left-[25%]',
      'UTG+1': 'top-[35%] left-[35%]',
      'MP': 'top-[30%] left-[45%]',
      'MP+1': 'top-[30%] right-[45%]',
      'HJ': 'top-[35%] right-[35%]',
      'CO': 'top-[45%] right-[25%]',
      'BTN': 'bottom-[45%] right-[25%]',
      'SB': 'bottom-[35%] right-[35%]',
      'BB': 'bottom-[30%] right-[45%]'
    };

    // Calculate total pot including blinds and raises
    const calculatePotAndChips = () => {
      let chips = {};
      // Add small blind
      chips['SB'] = { amount: 0.5, type: 'sb' };
      // Add big blind
      chips['BB'] = { amount: 1, type: 'bb' };
      
      // Add raise if exists
      if (raisePosition) {
        chips[raisePosition] = { amount: 3, type: 'raise' };
      }

      return chips;
    };

    const chips = calculatePotAndChips();

    return (
      <div className="relative w-full max-w-4xl h-[300px] mx-auto bg-green-800 rounded-[60%] border-8 border-brown-800 mb-8">
        {/* Center/Community Cards */}
        {showFlop && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
            {gameState.flopCards.map((card, index) => (
              <div key={index} className="w-10 h-14 bg-white rounded-lg shadow flex items-center justify-center">
                <span className={`text-xl ${getCardColor(card.suit)}`}>
                  {card.rank}{card.suit}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pot Size */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-16 text-yellow-400 font-bold">
          Pot: {gameState.potSize}BB
        </div>

        {/* Player Seats */}
        {gameState.players.map((player) => (
          <div
            key={player.position}
            className={`absolute ${seatPositions[player.position]}`}
          >
            {/* Cards above player if it's the selected position */}
            {player.position === selectedPosition && (
              <div className={`absolute ${cardPositions[player.position]} transform -translate-x-1/2 flex gap-1`}>
                {gameState.heroCards.map((card, idx) => (
                  <div key={idx} className="w-8 h-12 bg-white rounded-sm flex items-center justify-center shadow-lg">
                    <span className={`text-base ${getCardColor(card.suit)}`}>
                      {card.rank}{card.suit}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Chips on the felt */}
            {chips[player.position] && (
              <div className={`absolute ${chipPositions[player.position]} flex items-center justify-center`}>
                <div className={`w-10 h-10 rounded-full ${
                  chips[player.position].type === 'sb' ? 'bg-blue-500 border-blue-600' :
                  chips[player.position].type === 'bb' ? 'bg-red-500 border-red-600' :
                  'bg-yellow-500 border-yellow-600'
                } border-2 shadow-lg flex items-center justify-center text-white font-bold text-xs`}>
                  {chips[player.position].amount}BB
                </div>
              </div>
            )}

            <div className={`w-20 h-20 rounded-full flex flex-col items-center justify-center ${
              player.position === selectedPosition ? 'bg-blue-900' : 'bg-gray-800'
            } border-4 ${player.position === selectedPosition ? 'border-blue-500' : 'border-gray-700'}`}>
              <div className="text-white font-bold text-sm mb-1">{player.position}</div>
              <div className="text-yellow-400 text-xs">{player.stack} BB</div>
            </div>
          </div>
        ))}
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
      <div className="bg-gray-800 rounded-lg p-6 mt-8">
        <h4 className="text-lg font-semibold text-white mb-4">GTO Preflop Strategy</h4>
        <div className="flex items-end h-32 gap-4">
          <div className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-green-600 rounded-t"
              style={{ height: `${strategy.raise}%` }}
            />
            <div className="mt-2 text-white font-bold">{strategy.raise}%</div>
            <div className="text-gray-400 text-sm">Raise</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-yellow-600 rounded-t"
              style={{ height: `${strategy.call}%` }}
            />
            <div className="mt-2 text-white font-bold">{strategy.call}%</div>
            <div className="text-gray-400 text-sm">Call</div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-red-600 rounded-t"
              style={{ height: `${strategy.fold}%` }}
            />
            <div className="mt-2 text-white font-bold">{strategy.fold}%</div>
            <div className="text-gray-400 text-sm">Fold</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            ← Back to Home
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Poker Table Simulator
          </h2>
          <p className="mt-3 text-xl text-gray-300">
            Experience real-time GTO analysis in a familiar table setting
          </p>
        </div>

        {renderPokerTable()}
        {renderGTOBarChart()}

        <div className="fixed bottom-8 right-8 space-x-4">
          {gameState && (
            <button
              onClick={() => setShowFlop(!showFlop)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
            >
              {showFlop ? 'Hide Flop' : 'Show Flop'}
            </button>
          )}
          <button
            onClick={dealNewHand}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg"
          >
            Deal New Hand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialSimulator; 