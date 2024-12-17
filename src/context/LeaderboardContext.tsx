import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface Score {
    userId: string;
    username: string;
    score: number;
    level: number;
    completionTime: number;
    timestamp: number;
}

interface LeaderboardContextType {
    scores: Score[];
    addScore: (score: Omit<Score, 'timestamp'>) => void;
    getTopScores: (limit?: number) => Score[];
    getUserScores: (userId: string) => Score[];
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [scores, setScores] = useState<Score[]>([]);
    const channelRef = useRef<BroadcastChannel | null>(null);

    // Load scores from localStorage
    useEffect(() => {
        const savedScores = localStorage.getItem('leaderboard');
        if (savedScores) {
            setScores(JSON.parse(savedScores));
        }

        // Create broadcast channel
        channelRef.current = new BroadcastChannel('puzzle_game_leaderboard');
        
        // score updates from other tabs
        channelRef.current.onmessage = (event) => {
            if (event.data.type === 'SCORES_UPDATED') {
                const newScores = event.data.scores;
                setScores(prevScores => {
                    // Only update if scores are different
                    if (JSON.stringify(prevScores) !== JSON.stringify(newScores)) {
                        return newScores;
                    }
                    return prevScores;
                });
            }
        };

        return () => {
            channelRef.current?.close();
            channelRef.current = null;
        };
    }, []);

    // Save scores to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('leaderboard', JSON.stringify(scores));
        
        // score update to other tabs
        if (channelRef.current) {
            channelRef.current.postMessage({ type: 'SCORES_UPDATED', scores });
        }
    }, [scores]);

    const addScore = (newScore: Omit<Score, 'timestamp'>) => {
        const scoreWithTimestamp = {
            ...newScore,
            timestamp: Date.now()
        };

        setScores(prevScores => {
            const updatedScores = [...prevScores, scoreWithTimestamp]
                .sort((a, b) => b.score - a.score)
                .slice(0, 100);

            return updatedScores;
        });
    };

    const getTopScores = (limit = 10) => {
        return [...scores]
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    };

    const getUserScores = (userId: string) => {
        return scores
            .filter(score => score.userId === userId)
            .sort((a, b) => b.timestamp - a.timestamp);
    };

    return (
        <LeaderboardContext.Provider value={{ scores, addScore, getTopScores, getUserScores }}>
            {children}
        </LeaderboardContext.Provider>
    );
};

export const useLeaderboard = () => {
    const context = useContext(LeaderboardContext);
    if (!context) {
        throw new Error('useLeaderboard must be used within a LeaderboardProvider');
    }
    return context;
}; 