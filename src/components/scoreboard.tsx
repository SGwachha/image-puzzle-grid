/*
React Dependencies
*/
import React from 'react';

/*
Internal Dependencies
*/
import { useGame } from '../context/GameContext.tsx';
import { useAuth } from '../hooks/useAuth.ts';

const Scoreboard: React.FC = () => {
    const { state } = useGame();
    const { user } = useAuth();

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Score</h3>
            <div className="space-y-2">
                <div>Current Score: {user?.currentScore || 0}</div>
                <div>High Score: {user?.highestScore || 0}</div>
                <div>Level: {user?.currentLevel || 1}</div>
                <div>Incorrect Moves: {state.incorrectMoves}</div>
            </div>
        </div>
    );
};

export default Scoreboard;
