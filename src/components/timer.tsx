import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext.tsx';

const Timer: React.FC = () => {
    const { state, dispatch } = useGame();

    useEffect(() => {
        if (!state.isGameStarted) return;

        const timer = setInterval(() => {
            if (state.timeRemaining > 0) {
                dispatch({ type: 'DECREASE_TIME' });
            } else {
                dispatch({ type: 'RESET_GAME' });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [state.isGameStarted, state.timeRemaining, dispatch]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-xl font-bold">
            Time: {formatTime(state.timeRemaining)}
        </div>
    );
};

export default Timer;
