/*
React Dependencies
*/
import React from 'react';
import { GAME_SETTINGS } from '../utils/puzzleConfig.ts';

interface ScoreboardProps {
    score: number;
    level: number;
    timeLeft: number;
    incorrectMoves: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ 
    score = 0, 
    level = 1, 
    timeLeft = GAME_SETTINGS.INITIAL_TIME, 
    incorrectMoves = 0 
}) => {
    // Ensure all values are valid numbers
    const safeScore = isNaN(score) ? 0 : score;
    const safeLevel = isNaN(level) ? 1 : level;
    const safeTimeLeft = isNaN(timeLeft) ? GAME_SETTINGS.INITIAL_TIME : timeLeft;
    const safeIncorrectMoves = isNaN(incorrectMoves) ? 0 : incorrectMoves;

    const maxIncorrectMoves = GAME_SETTINGS.MAX_INCORRECT_MOVES;
    const movesLeft = Math.max(0, maxIncorrectMoves - safeIncorrectMoves);
    
    // Format time properly
    const minutes = Math.floor(Math.max(0, safeTimeLeft) / 60);
    const seconds = Math.floor(Math.max(0, safeTimeLeft) % 60);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                    <h3 className="text-gray-600 text-sm font-semibold">Score</h3>
                    <p className="text-2xl font-bold text-blue-600">{safeScore}</p>
                </div>
                <div className="text-center">
                    <h3 className="text-gray-600 text-sm font-semibold">Level</h3>
                    <p className="text-2xl font-bold text-purple-600">{safeLevel}</p>
                </div>
                <div className="text-center">
                    <h3 className="text-gray-600 text-sm font-semibold">Time Left</h3>
                    <p className="text-2xl font-bold text-green-600">{timeString}</p>
                </div>
                <div className="text-center">
                    <h3 className="text-gray-600 text-sm font-semibold">Moves Left</h3>
                    <p className={`text-2xl font-bold ${
                        movesLeft <= 2 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                        {movesLeft}
                    </p>
                </div>
            </div>
        </div>
    );
};
