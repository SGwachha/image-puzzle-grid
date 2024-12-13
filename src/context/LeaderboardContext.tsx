import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '../types';

interface LeaderboardState {
    scores: {
        userId: string;
        username: string;
        score: number;
        level: number;
        completionTime: number;
        timestamp: number;
    }[];
    isLoading: boolean;
}

type LeaderboardAction = 
    | { type: 'UPDATE_SCORE'; payload: LeaderboardState['scores'][0] }
    | { type: 'SET_SCORES'; payload: LeaderboardState['scores'] }
    | { type: 'SET_LOADING'; payload: boolean };

const initialState: LeaderboardState = {
    scores: [],
    isLoading: false
};

const leaderboardReducer = (state: LeaderboardState, action: LeaderboardAction): LeaderboardState => {
    switch (action.type) {
        case 'UPDATE_SCORE':
            const updatedScores = [...state.scores];
            const existingIndex = updatedScores.findIndex(s => s.userId === action.payload.userId);
            
            if (existingIndex >= 0) {
                updatedScores[existingIndex] = action.payload;
            } else {
                updatedScores.push(action.payload);
            }
            
            // Sort by score and timestamp
            updatedScores.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
            
            return {
                ...state,
                scores: updatedScores
            };

        case 'SET_SCORES':
            return {
                ...state,
                scores: action.payload
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };

        default:
            return state;
    }
};

const LeaderboardContext = createContext<{
    state: LeaderboardState;
    dispatch: React.Dispatch<LeaderboardAction>;
} | null>(null);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(leaderboardReducer, initialState);

    // Load scores from localStorage on mount
    useEffect(() => {
        const loadScores = () => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const savedScores = localStorage.getItem('leaderboardScores');
                if (savedScores) {
                    dispatch({ type: 'SET_SCORES', payload: JSON.parse(savedScores) });
                }
            } catch (error) {
                console.error('Error loading leaderboard:', error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        loadScores();

        // Set up storage event listener for cross-tab updates
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'leaderboardScores' && e.newValue) {
                dispatch({ type: 'SET_SCORES', payload: JSON.parse(e.newValue) });
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Save scores to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('leaderboardScores', JSON.stringify(state.scores));
    }, [state.scores]);

    return (
        <LeaderboardContext.Provider value={{ state, dispatch }}>
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