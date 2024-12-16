import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User } from '../types';
import { gameChannel } from '../utils/broadcastChannel.ts';
import { StorageManager } from '../utils/storage.ts';

interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    level: number;
    completionTime: number;
    timestamp: number;
    browser: string;
}

interface LeaderboardState {
    scores: LeaderboardEntry[];
    isLoading: boolean;
    error: string | null;
}

type LeaderboardAction = 
    | { type: 'UPDATE_SCORE'; payload: LeaderboardEntry }
    | { type: 'SET_SCORES'; payload: LeaderboardEntry[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'CLEAR_ERROR' };

const initialState: LeaderboardState = {
    scores: [],
    isLoading: false,
    error: null
};

const leaderboardReducer = (state: LeaderboardState, action: LeaderboardAction): LeaderboardState => {
    switch (action.type) {
        case 'UPDATE_SCORE': {
            const updatedScores = [...state.scores];
            const existingIndex = updatedScores.findIndex(s => s.userId === action.payload.userId);
            
            if (existingIndex >= 0) {
                // Update only if new score is higher
                if (action.payload.score > updatedScores[existingIndex].score) {
                    updatedScores[existingIndex] = action.payload;
                }
            } else {
                updatedScores.push(action.payload);
            }
            
            // Sort by score and timestamp
            updatedScores.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
            
            const topScores = updatedScores.slice(0, 100);
            
            return {
                ...state,
                scores: topScores,
                error: null
            };
        }

        case 'SET_SCORES':
            return {
                ...state,
                scores: action.payload,
                error: null
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};

export const LeaderboardContext = createContext<{
    state: LeaderboardState;
    dispatch: React.Dispatch<LeaderboardAction>;
    updateScore: (score: Omit<LeaderboardEntry, 'timestamp' | 'browser'>) => void;
} | null>(null);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(leaderboardReducer, initialState);

    const getBrowser = useCallback(() => {
        const userAgent = navigator.userAgent;
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Other';
    }, []);

    // Update score with browser info and broadcast
    const updateScore = useCallback((score: Omit<LeaderboardEntry, 'timestamp' | 'browser'>) => {
        const fullScore: LeaderboardEntry = {
            ...score,
            timestamp: Date.now(),
            browser: getBrowser()
        };

        // Update local state
        dispatch({ type: 'UPDATE_SCORE', payload: fullScore });

        // Save to storage using StorageManager
        const updatedScores = [...state.scores, fullScore];
        StorageManager.setItem('leaderboardScores', updatedScores);

        // Broadcast to other tabs
        gameChannel.broadcast({
            type: 'SCORE_UPDATE',
            payload: fullScore,
            userId: score.userId
        });
    }, [state.scores, getBrowser]);

    // Listen for score updates from other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'leaderboardScores') {
                const scores = StorageManager.getItem<LeaderboardEntry[]>('leaderboardScores');
                if (scores) {
                    dispatch({ type: 'SET_SCORES', payload: scores });
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Subscribe to broadcast channel
        const listenerId = `leaderboard-${Date.now()}`;
        gameChannel.subscribe(listenerId, (message) => {
            if (message.type === 'SCORE_UPDATE') {
                dispatch({ type: 'UPDATE_SCORE', payload: message.payload });
            }
        });

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            gameChannel.unsubscribe(listenerId);
        };
    }, []);

    // Load initial scores
    useEffect(() => {
        const loadScores = () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const scores = StorageManager.getItem<LeaderboardEntry[]>('leaderboardScores');
                if (scores) {
                    dispatch({ type: 'SET_SCORES', payload: scores });
                } else {
                    dispatch({ type: 'SET_SCORES', payload: [] });
                }
            } catch (error) {
                console.error('Error loading leaderboard:', error);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to load leaderboard' });
                dispatch({ type: 'SET_SCORES', payload: [] });
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadScores();
    }, []);

    return (
        <LeaderboardContext.Provider value={{ state, dispatch, updateScore }}>
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