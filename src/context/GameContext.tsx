import React, { createContext, useContext, useState, useEffect } from 'react';
import { secureLocalStorage } from '../utils/storage.ts';

interface GameState {
    gridSize: number;
    currentImage: string;
    points: number;
    incorrectMoves: number;
    timeRemaining: number;
    gameStatus: 'excellent' | 'good' | 'canDoBetter' | 'tryAgain' | 'playing';
    consecutiveFailures: number;
    timestamp?: number;
}

interface GameContextType {
    gridSize: number;
    setGridSize: (size: number) => void;
    currentImage: string;
    setCurrentImage: (image: string) => void;
    points: number;
    setPoints: (points: number | ((prev: number) => number)) => void;
    incorrectMoves: number;
    setIncorrectMoves: (moves: number) => void;
    timeRemaining: number;
    setTimeRemaining: (time: number) => void;
    gameStatus: 'excellent' | 'good' | 'canDoBetter' | 'tryAgain' | 'playing';
    setGameStatus: (status: 'excellent' | 'good' | 'canDoBetter' | 'tryAgain' | 'playing') => void;
    consecutiveFailures: number;
    resetGame: () => void;
    calculateScore: () => void;
}

const INITIAL_STATE: GameState = {
    gridSize: 2,
    currentImage: '',
    points: 3,
    incorrectMoves: 0,
    timeRemaining: 300,
    gameStatus: 'playing',
    consecutiveFailures: 0
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_POINTS = 3;
const TIME_PENALTY = 10;
const BASE_TIME = 300;
const MAX_CONSECUTIVE_FAILURES = 3;

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<GameState>(INITIAL_STATE);

    // Load saved game state
    useEffect(() => {
        const savedState = secureLocalStorage.getItem<GameState>('gameState');
        if (savedState) {
            setState({
                ...INITIAL_STATE,
                ...savedState,
                timestamp: Date.now()
            });
        }
    }, []);

    // Save game state
    useEffect(() => {
        secureLocalStorage.setItem('gameState', {
            ...state,
            timestamp: Date.now()
        });
    }, [state]);

    // Watch for game failures
    useEffect(() => {
        if (state.gameStatus === 'tryAgain') {
            const newFailures = state.consecutiveFailures + 1;
            setState(prev => ({
                ...prev,
                consecutiveFailures: newFailures
            }));
            
            if (newFailures >= MAX_CONSECUTIVE_FAILURES) {
                secureLocalStorage.clear();
                setState(INITIAL_STATE);
            }
        } else if (['excellent', 'good', 'canDoBetter'].includes(state.gameStatus)) {
            setState(prev => ({
                ...prev,
                consecutiveFailures: 0
            }));
        }
    }, [state.gameStatus]);

    const calculateScore = () => {
        const timeUsedPercentage = (BASE_TIME - state.timeRemaining) / BASE_TIME * 100;
        
        let newStatus: GameState['gameStatus'] = 'playing';
        if (state.timeRemaining <= 0 || state.incorrectMoves > 6) {
            newStatus = 'tryAgain';
        } else if (timeUsedPercentage <= 30 && state.incorrectMoves === 0) {
            newStatus = 'excellent';
        } else if (timeUsedPercentage <= 50 && state.incorrectMoves <= 3) {
            newStatus = 'good';
        } else if (timeUsedPercentage <= 99 && state.incorrectMoves <= 6) {
            newStatus = 'canDoBetter';
        } else {
            newStatus = 'tryAgain';
        }

        setState(prev => ({
            ...prev,
            gameStatus: newStatus
        }));
    };

    const resetGame = () => {
        setState({
            ...INITIAL_STATE,
            timestamp: Date.now()
        });
    };

    return (
        <GameContext.Provider
            value={{
                gridSize: state.gridSize,
                setGridSize: (size) => setState(prev => ({ ...prev, gridSize: size })),
                currentImage: state.currentImage,
                setCurrentImage: (image) => setState(prev => ({ ...prev, currentImage: image })),
                points: state.points,
                setPoints: (points) => setState(prev => ({ 
                    ...prev, 
                    points: typeof points === 'function' ? points(prev.points) : points 
                })),
                incorrectMoves: state.incorrectMoves,
                setIncorrectMoves: (moves) => setState(prev => ({ ...prev, incorrectMoves: moves })),
                timeRemaining: state.timeRemaining,
                setTimeRemaining: (time) => setState(prev => ({ ...prev, timeRemaining: time })),
                gameStatus: state.gameStatus,
                setGameStatus: (status) => setState(prev => ({ ...prev, gameStatus: status })),
                consecutiveFailures: state.consecutiveFailures,
                resetGame,
                calculateScore
            }}
        >
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