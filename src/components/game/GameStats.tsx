import React from 'react';
import { useGame } from '../../context/GameContext';

const GameStats: React.FC = () => {
    const { state } = useGame();

    return (
        <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-600">
                Points: <span className="text-blue-600">{state.points}</span>
            </div>
            <div className="text-sm font-medium text-gray-600">
                Previews Used: <span className="text-blue-600">{state.previewsUsed}</span>
            </div>
            <div className="text-sm font-medium text-gray-600">
                Incorrect Moves: <span className="text-red-600">{state.incorrectMoves}</span>
            </div>
            <div className="text-sm font-medium text-gray-600">
                Time Remaining: <span className="text-green-600">
                    {Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, '0')}
                </span>
            </div>
        </div>
    );
};

export default GameStats; 