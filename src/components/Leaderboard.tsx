import React, { useState, useEffect } from 'react';
import { useLeaderboard } from '../context/LeaderboardContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export const Leaderboard: React.FC = () => {
    const { getTopScores, getUserScores } = useLeaderboard();
    const { user } = useAuth();
    const [view, setView] = useState<'global' | 'personal'>('global');
    const [scores, setScores] = useState<any[]>([]);

    useEffect(() => {
        const updateScores = () => {
            const newScores = view === 'global' ? getTopScores(10) : getUserScores(user?.id || '');
            setScores(newScores);
        };

        updateScores();

        // score updates
        const channel = new BroadcastChannel('puzzle_game_leaderboard');
        channel.onmessage = (event) => {
            if (event.data.type === 'SCORES_UPDATED') {
                updateScores();
            }
        };

        return () => channel.close();
    }, [view, user?.id, getTopScores, getUserScores]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setView('global')}
                        className={`px-3 py-1 rounded text-sm ${
                            view === 'global'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setView('personal')}
                        className={`px-3 py-1 rounded text-sm ${
                            view === 'personal'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        disabled={!user}
                    >
                        Personal
                    </button>
                </div>
            </div>
            
            {scores.length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                    {view === 'global' ? 'No scores yet. Be the first!' : 'You haven\'t completed any puzzles yet.'}
                </p>
            ) : (
                <div className="space-y-2">
                    {scores.map((score, index) => (
                        <div
                            key={`${score.userId}-${score.timestamp}`}
                            className={`flex items-center justify-between p-3 rounded ${
                                view === 'global' ? (
                                    index === 0 ? 'bg-yellow-100' :
                                    index === 1 ? 'bg-gray-100' :
                                    index === 2 ? 'bg-orange-100' :
                                    'bg-white'
                                ) : 'bg-blue-50'
                            } ${score.userId === user?.id ? 'border-2 border-blue-400' : ''}`}
                        >
                            <div className="flex items-center space-x-3">
                                {view === 'global' && (
                                    <span className="font-bold text-gray-700 w-6">
                                        #{index + 1}
                                    </span>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {score.username}
                                        {score.userId === user?.id && ' (You)'}
                                    </p>
                                    <div className="text-sm text-gray-600">
                                        <span>Level {score.level + 1}</span>
                                        <span className="mx-2">•</span>
                                        <span>{formatTime(score.completionTime)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800">
                                    {score.score.toLocaleString()} pts
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(score.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 