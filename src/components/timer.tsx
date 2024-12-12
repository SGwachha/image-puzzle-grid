import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext.tsx';

const Timer: React.FC = () => {
    const { state, dispatch } = useGame();

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (state.isGameStarted && state.timeRemaining > 0) {
            timer = setInterval(() => {
                dispatch({ type: 'DECREASE_TIME' });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [dispatch, state.isGameStarted, state.timeRemaining]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">Time Remaining</h3>
            <div className="text-3xl font-mono">
                {formatTime(state.timeRemaining)}
            </div>
            {!state.isGameStarted && (
                <div className="text-sm text-gray-500 mt-2">
                    Timer will start when you move the first piece
                </div>
            )}
        </div>
    );
};

export default Timer;
