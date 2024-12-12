/*
Type Definitions
*/
export interface User {
    id: string;
    username: string;
    hashedPassword: string;
    currentScore: number;
    highestScore: number;
    currentLevel: number;
}

export interface PuzzlePiece {
    id: number;
    currentPosition: number;
    correctPosition: number;
    imageUrl: string;
}

export interface GameState {
    currentGrid: number;
    timeRemaining: number;
    incorrectMoves: number;
    points: number;
    previewsUsed: number;
    currentImage: string;
    currentImageDetails: {
        name: string;
        difficulty: string;
        category: string;
    } | null;
    pieces: PuzzlePiece[];
    isGameStarted: boolean;
    currentLevel: number;
    consecutiveFailures: number;
    completedImages: string[];
    maxTime: number;
} 