/*
React Dependencies
*/
import React, { createContext, useContext, useReducer, useEffect } from 'react';

/*
Internal Dependencies
*/
import { GameState, PuzzlePiece } from '../types';
import { getRandomPuzzleImage } from '../config/images.ts';

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
    | { type: 'START_GAME' }
    | { type: 'SET_GRID_SIZE'; size: number }
    | { type: 'MOVE_PIECE'; pieceId: number; newPosition: number }
    | { type: 'DECREASE_TIME' }
    | { type: 'USE_PREVIEW' }
    | { type: 'RESET_GAME' }
    | { type: 'NEXT_LEVEL' }
    | { type: 'RECORD_INCORRECT_MOVE' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_GAME':
            const image = getRandomPuzzleImage();
            const pieces = generatePuzzlePieces(state.currentGrid, image.url);
            return {
                ...state,
                currentImage: image.url,
                currentImageDetails: {
                    name: image.name,
                    difficulty: getDifficulty(state.currentGrid),
                    category: 'general'
                },
                pieces: shufflePieces(pieces),
                isGameStarted: true,
                timeRemaining: state.maxTime - ((state.currentLevel - 1) * 30)
            };

        case 'SET_GRID_SIZE':
            return {
                ...state,
                currentGrid: action.size,
                pieces: []
            };

        case 'MOVE_PIECE':
            const updatedPieces = state.pieces.map(piece => {
                if (piece.id === action.pieceId) {
                    return { ...piece, currentPosition: action.newPosition };
                }
                return piece;
            });
            return {
                ...state,
                pieces: updatedPieces
            };

        case 'DECREASE_TIME':
            return {
                ...state,
                timeRemaining: Math.max(0, state.timeRemaining - 1)
            };

        case 'USE_PREVIEW':
            if (state.points > 0) {
                return {
                    ...state,
                    points: state.points - 1,
                    previewsUsed: state.previewsUsed + 1
                };
            }
            return state;

        case 'RECORD_INCORRECT_MOVE':
            return {
                ...state,
                incorrectMoves: state.incorrectMoves + 1,
                timeRemaining: Math.max(0, state.timeRemaining - 10)
            };

        case 'NEXT_LEVEL':
            if (state.consecutiveFailures >= 3) {
                localStorage.clear();
                return initialState;
            }

            const newLevel = state.currentLevel + 1;
            const newState = {
                ...state,
                currentLevel: newLevel,
                incorrectMoves: 0,
                isGameStarted: false,
                completedImages: [...state.completedImages, state.currentImage],
                maxTime: Math.max(60, state.maxTime - 30),
                timeRemaining: Math.max(60, state.maxTime - 30),
                currentGrid: Math.min(12, state.currentGrid + (newLevel % 3 === 0 ? 1 : 0))
            };

            localStorage.setItem('puzzleGameState', JSON.stringify(newState));
            return newState;

        case 'RESET_GAME':
            const resetState = {
                ...initialState,
                consecutiveFailures: state.consecutiveFailures + 1
            };

            if (resetState.consecutiveFailures >= 3) {
                localStorage.clear();
                return initialState;
            }

            localStorage.setItem('puzzleGameState', JSON.stringify(resetState));
            return resetState;

        default:
            return state;
    }
};

// Helper functions
const generatePuzzlePieces = (gridSize: number, imageUrl: string): PuzzlePiece[] => {
    const totalPieces = gridSize * gridSize;
    const pieces: PuzzlePiece[] = [];

    for (let i = 0; i < totalPieces; i++) {
        pieces.push({
            id: i,
            currentPosition: i,
            correctPosition: i,
            imageUrl,
            isCorrect: false,
            gridSize
        });
    }

    return pieces;
};

const shufflePieces = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
    const shuffled = [...pieces];
    let currentIndex = shuffled.length;

    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap positions
        const temp = shuffled[currentIndex].currentPosition;
        shuffled[currentIndex].currentPosition = shuffled[randomIndex].currentPosition;
        shuffled[randomIndex].currentPosition = temp;
    }

    // Ensure puzzle is solvable
    if (!isPuzzleSolvable(shuffled)) {
        // Swap last two pieces if puzzle is not solvable
        const lastIndex = shuffled.length - 1;
        const temp = shuffled[lastIndex].currentPosition;
        shuffled[lastIndex].currentPosition = shuffled[lastIndex - 1].currentPosition;
        shuffled[lastIndex - 1].currentPosition = temp;
    }

    return shuffled;
};

const isPuzzleSolvable = (pieces: PuzzlePiece[]): boolean => {
    let inversions = 0;
    for (let i = 0; i < pieces.length - 1; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
            if (pieces[i].currentPosition > pieces[j].currentPosition) {
                inversions++;
            }
        }
    }
    return inversions % 2 === 0;
};

const getDifficulty = (gridSize: number): string => {
    if (gridSize <= 3) return 'Easy';
    if (gridSize <= 6) return 'Medium';
    return 'Hard';
};

export const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
} | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState, () => {
        const savedState = localStorage.getItem('puzzleGameState');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                if (parsedState.currentLevel && parsedState.timeRemaining) {
                    return parsedState;
                }
            } catch (error) {
                console.error('Error loading saved state:', error);
            }
        }
        return initialState;
    });

    useEffect(() => {
        if (state.isGameStarted) {
            localStorage.setItem('puzzleGameState', JSON.stringify(state));
        }
    }, [state]);

    useEffect(() => {
        if (state.isGameStarted && state.timeRemaining > 0) {
            const timer = setInterval(() => {
                dispatch({ type: 'DECREASE_TIME' });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [state.isGameStarted, state.timeRemaining]);

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

const saveState = (state: GameState) => {
    try {
        localStorage.setItem('puzzleGameState', JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save game state:', error);
        // Handle storage quota exceeded
        if (error.name === 'QuotaExceededError') {
            localStorage.clear();
            localStorage.setItem('puzzleGameState', JSON.stringify(state));
        }
    }
}; 