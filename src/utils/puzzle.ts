import { PuzzlePiece } from '../types';

export const generatePuzzlePieces = (gridSize: number, imageUrl: string): PuzzlePiece[] => {
    const totalPieces = gridSize * gridSize;
    const pieces: PuzzlePiece[] = [];

    for (let i = 0; i < totalPieces; i++) {
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        
        pieces.push({
            id: i,
            currentPosition: i,
            correctPosition: i,
            imageUrl,
            isCorrect: false,
            gridSize,
            backgroundPosition: {
                x: (col * (100 / (gridSize - 1))),
                y: (row * (100 / (gridSize - 1)))
            }
        });
    }

    return pieces;
};

export const shufflePieces = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
    const shuffled = [...pieces];
    let currentIndex = shuffled.length;
    let inversions = 0;

    while (currentIndex > 1) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        const temp = shuffled[currentIndex].currentPosition;
        shuffled[currentIndex].currentPosition = shuffled[randomIndex].currentPosition;
        shuffled[randomIndex].currentPosition = temp;

        if (shuffled[currentIndex].currentPosition > shuffled[randomIndex].currentPosition) {
            inversions++;
        }
    }

    // Ensure puzzle is solvable
    if (!isPuzzleSolvable(shuffled)) {
        const lastIndex = shuffled.length - 1;
        const temp = shuffled[lastIndex].currentPosition;
        shuffled[lastIndex].currentPosition = shuffled[lastIndex - 1].currentPosition;
        shuffled[lastIndex - 1].currentPosition = temp;
    }

    return shuffled;
};

// Check if puzzle is solvable using inversion count
export const isPuzzleSolvable = (pieces: PuzzlePiece[]): boolean => {
    let inversions = 0;
    
    for (let i = 0; i < pieces.length - 1; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
            if (pieces[i].currentPosition > pieces[j].currentPosition) {
                inversions++;
            }
        }
    }
    
    const gridSize = Math.sqrt(pieces.length);
    if (gridSize % 2 === 1) {
        return inversions % 2 === 0;
    } else {
        const rowFromBottom = Math.floor(pieces[pieces.length - 1].currentPosition / gridSize);
        return (inversions + rowFromBottom) % 2 === 0;
    }
};

// Validate piece position
export const validatePiecePosition = (piece: PuzzlePiece, targetPosition: number): boolean => {
    return piece.correctPosition === targetPosition;
};

// Calculate piece dimensions based on grid size
export const calculatePieceDimensions = (gridSize: number, containerWidth: number): {
    width: number;
    height: number;
} => {
    const pieceSize = Math.floor(containerWidth / gridSize);
    return {
        width: pieceSize,
        height: pieceSize
    };
}; 