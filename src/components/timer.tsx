import React, { useEffect, useContext } from 'react';
import { useGame } from '../context/GameContext.tsx';

export const Timer: React.FC = () => {
    const { gameState, dispatch } = useGame();

    useEffect(() => {
        const timer = setInterval(() => {
            if (gameState.timeRemaining > 0 && gameState.gameStatus === 'playing') {
                dispatch({ type: 'UPDATE_TIME', payload: gameState.timeRemaining - 1 });
            } else if (gameState.timeRemaining <= 0) {
                dispatch({ type: 'GAME_OVER' });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState.timeRemaining, gameState.gameStatus, dispatch]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-2xl font-bold">
            Time: {formatTime(gameState.timeRemaining)}
        </div>
    );
};
