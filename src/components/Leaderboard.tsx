import React from 'react';
import { useLeaderboard } from '../context/LeaderboardContext.tsx';

const Leaderboard: React.FC = () => {
    const { state } = useLeaderboard();

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
            {state.isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="space-y-2">
                    {state.scores.map((score, index) => (
                        <div
                            key={`${score.userId}-${score.timestamp}`}
                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                            <div className="flex items-center space-x-4">
                                <span className="font-bold">{index + 1}.</span>
                                <span>{score.username}</span>
                            </div>
                            <div className="flex space-x-4 text-sm text-gray-600">
                                <span>Level {score.level}</span>
                                <span>{score.score} pts</span>
                                <span>{formatTime(score.completionTime)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Leaderboard; 