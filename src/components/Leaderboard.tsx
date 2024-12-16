import React, { useEffect, useState } from 'react';
import { decryptData } from '../utils/security.ts';

interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    level: number;
    completionTime: number;
    rating: string;
}

export const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        const loadLeaderboard = () => {
            try {
                const encryptedData = localStorage.getItem('puzzleLeaderboard');
                if (encryptedData) {
                    const decryptedData = decryptData(encryptedData);
                    const data = JSON.parse(decryptedData);
                    setLeaderboard(data);
                }
            } catch (error) {
                console.error('Error loading leaderboard:', error);
            }
        };

        loadLeaderboard();
        
        // For storage changes from other tabs
        window.addEventListener('storage', loadLeaderboard);
        return () => window.removeEventListener('storage', loadLeaderboard);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2">Rank</th>
                            <th className="px-4 py-2">Player</th>
                            <th className="px-4 py-2">Score</th>
                            <th className="px-4 py-2">Level</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, index) => (
                            <tr key={entry.userId} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="px-4 py-2 text-center">{index + 1}</td>
                                <td className="px-4 py-2">{entry.username}</td>
                                <td className="px-4 py-2 text-center">{entry.score}</td>
                                <td className="px-4 py-2 text-center">{entry.level}</td>
                                <td className="px-4 py-2 text-center">
                                    {Math.floor(entry.completionTime / 60)}:{(entry.completionTime % 60).toString().padStart(2, '0')}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <span className={`px-2 py-1 rounded ${
                                        entry.rating === 'Excellent' ? 'bg-green-100 text-green-800' :
                                        entry.rating === 'Good Job' ? 'bg-blue-100 text-blue-800' :
                                        entry.rating === 'You Can Do Better' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {entry.rating}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}; 