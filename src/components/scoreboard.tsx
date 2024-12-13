/*
React Dependencies
*/
import React from 'react';

/*
Internal Dependencies
*/
import { useGame } from '../context/GameContext.tsx';

const Scoreboard: React.FC = () => {
    const { state } = useGame();

    const calculateScore = (): { score: number; rating: string } => {
        const timeUsedPercentage = (state.maxTime - state.timeRemaining) / state.maxTime * 100;

        if (timeUsedPercentage <= 30 && state.incorrectMoves === 0) {
            return { score: 100, rating: 'Excellent!' };
        } else if (timeUsedPercentage <= 50 && state.incorrectMoves <= 3) {
            return { score: 75, rating: 'Good Job!' };
        } else if (timeUsedPercentage <= 99 && state.incorrectMoves <= 6) {
            return { score: 50, rating: 'You Can Do Better' };
        } else {
            return { score: 25, rating: 'Please Try Again' };
        }
    };

    const { score, rating } = calculateScore();

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Score</h2>
            <div className="space-y-2">
                <p>Level: {state.currentLevel}</p>
                <p>Incorrect Moves: {state.incorrectMoves}</p>
                <p>Current Score: {score}</p>
                <p>Rating: {rating}</p>
                <p>Points Remaining: {state.points}</p>
            </div>
        </div>
    );
};

export default Scoreboard;
