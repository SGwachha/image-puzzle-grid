import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext.tsx';

export const Timer: React.FC = () => {
    const { timeRemaining, setTimeRemaining, incorrectMoves, gameStatus } = useGame();
    const [showPenalty, setShowPenalty] = useState(false);
    const [lastIncorrectMoves, setLastIncorrectMoves] = useState(0);

    // Handle countdown
    useEffect(() => {
        let timerId: NodeJS.Timeout | null = null;

        if (timeRemaining > 0 && gameStatus === 'playing') {
            timerId = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = Math.max(0, prev - 1);
                    if (newTime === 0) {
                        clearInterval(timerId!);
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    }, [gameStatus, timeRemaining, setTimeRemaining]);

    // Show penalty
    useEffect(() => {
        if (incorrectMoves > lastIncorrectMoves) {
            setShowPenalty(true);
            const timer = setTimeout(() => setShowPenalty(false), 1000);
            setLastIncorrectMoves(incorrectMoves);
            return () => clearTimeout(timer);
        }
    }, [incorrectMoves, lastIncorrectMoves]);

    const formatTime = (seconds: number): string => {
        if (typeof seconds !== 'number' || isNaN(seconds)) {
            return '0:00';
        }
        const minutes = Math.floor(Math.max(0, seconds) / 60);
        const remainingSeconds = Math.max(0, seconds) % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getTimeColor = useCallback(() => {
        if (typeof timeRemaining !== 'number' || isNaN(timeRemaining)) {
            return 'text-red-500';
        }
        const percentage = (timeRemaining / 300) * 100;
        if (percentage > 70) return 'text-green-500';
        if (percentage > 50) return 'text-blue-500';
        if (percentage > 30) return 'text-yellow-500';
        return 'text-red-500';
    }, [timeRemaining]);

    const getTimeStatus = useCallback(() => {
        if (typeof timeRemaining !== 'number' || isNaN(timeRemaining)) {
            return 'Time Running Out!';
        }
        const percentage = (timeRemaining / 300) * 100;
        if (percentage > 70) return 'Excellent Time';
        if (percentage > 50) return 'Good Progress';
        if (percentage > 30) return 'Hurry Up!';
        return 'Time Running Out!';
    }, [timeRemaining]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Time Remaining</h2>
                <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${getTimeColor()} ${
                    showPenalty ? 'animate-pulse text-red-600' : ''
                }`}>
                    {formatTime(timeRemaining)}
                </div>
                <div className={`text-sm font-medium ${getTimeColor()}`}>
                    {getTimeStatus()}
                </div>
                {incorrectMoves > 0 && (
                    <div className="mt-2">
                        <div className="text-sm text-red-500">
                            Penalties: -{incorrectMoves * 10}s
                        </div>
                        <div className="text-xs text-gray-500">
                            ({incorrectMoves} incorrect moves)
                        </div>
                    </div>
                )}
                {showPenalty && (
                    <div className="text-sm text-red-500 animate-bounce mt-2">
                        -10s Penalty!
                    </div>
                )}
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-300 ${getTimeColor()} bg-current`}
                    style={{ width: `${Math.max(0, Math.min(100, (timeRemaining / 300) * 100))}%` }}
                />
            </div>
        </div>
    );
};
