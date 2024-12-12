/*
React Dependencies
*/
import React, { createContext, useContext, useReducer } from 'react';

/*
Internal Dependencies
*/
import { GameState, PuzzlePiece } from '../types';

const initialState: GameState = {
    currentGrid: 2,
    timeRemaining: 300,
    incorrectMoves: 0,
    points: 3,
    previewsUsed: 0,
    currentImage: '',
    currentImageDetails: null,
    pieces: [],
    isGameStarted: false,
    currentLevel: 1,
    consecutiveFailures: 0,
    completedImages: [],
    maxTime: 300
};

type GameAction = 
    | { type: 'INCREASE_GRID' }
    | { type: 'DECREASE_TIME' }
    | { type: 'INCREMENT_INCORRECT_MOVES' }
    | { type: 'USE_PREVIEW' }
    | { type: 'SET_PIECES', pieces: PuzzlePiece[] }
    | { type: 'START_GAME' }
    | { type: 'SET_CURRENT_IMAGE', payload: { url: string, details: { name: string, difficulty: string, category: string } } }
    | { type: 'UPDATE_SCORE' }
    | { type: 'LEVEL_COMPLETE' }
    | { type: 'LEVEL_FAILED' };

const calculateScore = (timeUsed: number, incorrectMoves: number, maxTime: number): {
    score: number;
    rating: 'excellent' | 'good' | 'average' | 'failed';
} => {
    const timePercentage = (timeUsed / maxTime) * 100;
    
    if (timePercentage <= 30 && incorrectMoves === 0) {
        return { score: 100, rating: 'excellent' };
    } else if (timePercentage <= 50 && incorrectMoves <= 3) {
        return { score: 75, rating: 'good' };
    } else if (timePercentage <= 99 && incorrectMoves <= 6) {
        return { score: 50, rating: 'average' };
    }
    return { score: 0, rating: 'failed' };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'INCREASE_GRID':
            return {
                ...state,
                currentGrid: Math.min(state.currentGrid + 1, 12)
            };
        case 'DECREASE_TIME':
            return {
                ...state,
                timeRemaining: state.isGameStarted 
                    ? Math.max(0, state.timeRemaining - 1)
                    : state.timeRemaining
            };
        case 'INCREMENT_INCORRECT_MOVES':
            return {
                ...state,
                incorrectMoves: state.incorrectMoves + 1,
                timeRemaining: state.timeRemaining - 10
            };
        case 'USE_PREVIEW':
            return {
                ...state,
                points: Math.max(0, state.points - 1),
                previewsUsed: state.previewsUsed + 1
            };
        case 'SET_PIECES':
            return {
                ...state,
                pieces: action.pieces
            };
        case 'START_GAME':
            return {
                ...state,
                isGameStarted: true
            };
        case 'SET_CURRENT_IMAGE':
            return {
                ...state,
                currentImage: action.payload.url,
                currentImageDetails: action.payload.details
            };
        default:
            return state;
    }
};

const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
} | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);
    
    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}; 