/*
React Dependencies
*/
import React, { useEffect, useState } from 'react';

/*
Internal Dependencies
*/
import { useGame } from '../context/GameContext.tsx';
import { PuzzlePiece } from '../types';
import { getRandomPuzzleImage, PuzzleImage } from '../config/images.ts';

const PuzzleGrid: React.FC = () => {
    const { state, dispatch } = useGame();
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${state.currentGrid}, 1fr)`,
        gap: '2px',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto'
    };

    // Handle drag start
    const handleDragStart = (pieceId: number) => {
        setDraggedPiece(pieceId);
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Handle drop
    const handleDrop = (targetPosition: number) => {
        if (draggedPiece === null) return;

        const piece = state.pieces.find(p => p.id === draggedPiece);
        if (!piece) return;

        // Check if the move is correct
        const isCorrectMove = targetPosition === piece.correctPosition;
        
        if (!isCorrectMove) {
            dispatch({ type: 'RECORD_INCORRECT_MOVE' });
        }

        dispatch({
            type: 'MOVE_PIECE',
            pieceId: draggedPiece,
            newPosition: targetPosition
        });

        setDraggedPiece(null);
        validatePuzzleCompletion();
    };

    // Validate if puzzle is complete
    const validatePuzzleCompletion = () => {
        if (isValidating) return;
        setIsValidating(true);

        const isComplete = state.pieces.every(piece => 
            piece.currentPosition === piece.correctPosition
        );

        if (isComplete) {
            dispatch({ type: 'NEXT_LEVEL' });
        }

        setIsValidating(false);
    };

    // Start game when component mounts
    useEffect(() => {
        if (!state.isGameStarted) {
            dispatch({ type: 'START_GAME' });
        }
    }, [state.isGameStarted, dispatch]);

    return (
        <div style={gridStyle}>
            {state.pieces.map((piece) => {
                const currentPiece = state.pieces.find(p => p.currentPosition === piece.id);
                if (!currentPiece) return null;

                return (
                    <div
                        key={piece.id}
                        draggable
                        onDragStart={() => handleDragStart(currentPiece.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(piece.id)}
                        className={`
                            aspect-w-1 aspect-h-1 relative
                            ${currentPiece.currentPosition === currentPiece.correctPosition 
                                ? 'border-2 border-green-500' 
                                : 'border border-gray-300'}
                            cursor-move hover:opacity-90 transition-opacity
                        `}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${currentPiece.imageUrl})`,
                                backgroundPosition: `${(piece.id % state.currentGrid) * (100 / (state.currentGrid - 1))}% ${Math.floor(piece.id / state.currentGrid) * (100 / (state.currentGrid - 1))}%`,
                                backgroundSize: `${state.currentGrid * 100}%`
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default PuzzleGrid;
