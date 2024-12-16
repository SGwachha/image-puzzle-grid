import React, { createContext, useReducer, useEffect, ReactNode, useContext } from 'react';
import { encryptData, decryptData } from '../utils/security.ts';
import { GAME_SETTINGS, PUZZLE_IMAGES } from '../utils/puzzleConfig.ts';

export interface GameState {
    score: number;
    level: number;
    timeRemaining: number;
    incorrectMoves: number;
    previewsRemaining: number;
    currentImage: number;
    gridSize: number;
    consecutiveFailures: number;
    isPreviewActive: boolean;
    gameStatus: 'playing' | 'completed' | 'failed';
}

type GameAction = 
    | { type: 'PUZZLE_COMPLETED' }
    | { type: 'INCORRECT_MOVE' }
    | { type: 'USE_PREVIEW' }
    | { type: 'UPDATE_TIME'; payload: number }
    | { type: 'RESET_GAME' }
    | { type: 'SET_GRID_SIZE'; payload: number }
    | { type: 'TOGGLE_PREVIEW' }
    | { type: 'GAME_OVER' };

const initialState: GameState = {
    score: GAME_SETTINGS.INITIAL_POINTS,
    level: 1,
    timeRemaining: GAME_SETTINGS.INITIAL_TIME,
    incorrectMoves: 0,
    previewsRemaining: 3,
    currentImage: 0,
    gridSize: 2,
    consecutiveFailures: 0,
    isPreviewActive: false,
    gameStatus: 'playing'
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'PUZZLE_COMPLETED':
            const nextLevel = state.level + 1;
            const nextImage = (state.currentImage + 1) % PUZZLE_IMAGES.length;
            return {
                ...state,
                level: nextLevel,
                currentImage: nextImage,
                timeRemaining: Math.max(
                    GAME_SETTINGS.INITIAL_TIME - (nextLevel * GAME_SETTINGS.TIME_REDUCTION_PER_LEVEL),
                    120
                ),
                consecutiveFailures: 0,
                gameStatus: nextLevel > PUZZLE_IMAGES.length ? 'completed' : 'playing'
            };

        case 'INCORRECT_MOVE':
            const newIncorrectMoves = state.incorrectMoves + 1;
            return {
                ...state,
                incorrectMoves: newIncorrectMoves,
                timeRemaining: state.timeRemaining - GAME_SETTINGS.TIME_PENALTY_PER_MISTAKE,
                gameStatus: newIncorrectMoves > GAME_SETTINGS.MAX_INCORRECT_MOVES ? 'failed' : 'playing'
            };

        case 'USE_PREVIEW':
            return {
                ...state,
                score: Math.max(0, state.score - 1),
                previewsRemaining: state.previewsRemaining - 1,
                isPreviewActive: true
            };

        case 'TOGGLE_PREVIEW':
            return {
                ...state,
                isPreviewActive: !state.isPreviewActive
            };

        case 'GAME_OVER':
            const newFailures = state.consecutiveFailures + 1;
            return {
                ...state,
                consecutiveFailures: newFailures,
                gameStatus: newFailures >= GAME_SETTINGS.MAX_CONSECUTIVE_FAILURES ? 'failed' : 'playing'
            };

        case 'RESET_GAME':
            return initialState;

        default:
            return state;
    }
};

export const GameContext = createContext<{
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
}>({
    gameState: initialState,
    dispatch: () => null
});

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    // Load game state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('puzzleGameState');
        if (savedState) {
            try {
                const decryptedState = decryptData(savedState);
                const parsedState = JSON.parse(decryptedState);
                dispatch({ type: 'RESET_GAME', payload: parsedState });
            } catch (error) {
                console.error('Error loading game state:', error);
            }
        }
    }, []);

    // Save game state to localStorage on changes
    useEffect(() => {
        const encryptedState = encryptData(JSON.stringify(gameState));
        localStorage.setItem('puzzleGameState', encryptedState);
    }, [gameState]);

    // Handle preview timer
    useEffect(() => {
        if (gameState.isPreviewActive) {
            const timer = setTimeout(() => {
                dispatch({ type: 'TOGGLE_PREVIEW' });
            }, GAME_SETTINGS.PREVIEW_DURATION);
            return () => clearTimeout(timer);
        }
    }, [gameState.isPreviewActive]);

    return (
        <GameContext.Provider value={{ gameState, dispatch }}>
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