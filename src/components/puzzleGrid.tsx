import React, { useState, useEffect, useContext } from 'react';
import { useGame } from '../context/GameContext.tsx';

interface PuzzleGridProps {
    imageUrl: string;
    gridSize: number;
}

interface PuzzlePiece {
    id: number;
    currentPosition: number;
    correctPosition: number;
    imageUrl: string;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ imageUrl, gridSize = 2 }) => {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const { gameState, dispatch } = useGame();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [pieceSize, setPieceSize] = useState({ width: 400, height: 400 });
    const [error, setError] = useState<string | null>(null);
    
    const initializePuzzle = () => {
        try {
            if (!gridSize || gridSize <= 0) {
                setError('Invalid grid size');
                return;
            }
            
            const totalPieces = gridSize * gridSize;
            const newPieces: PuzzlePiece[] = [];
            
            for (let i = 0; i < totalPieces; i++) {
                newPieces.push({
                    id: i,
                    currentPosition: i,
                    correctPosition: i,
                    imageUrl: imageUrl
                });
            }
            
            // Custom shuffle algorithm
            for (let i = newPieces.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newPieces[i].currentPosition, newPieces[j].currentPosition] = 
                [newPieces[j].currentPosition, newPieces[i].currentPosition];
            }
            
            setPieces(newPieces);
            setError(null);
        } catch (err) {
            setError('Failed to initialize puzzle');
            console.error('Puzzle initialization error:', err);
        }
    };

    const handleDragStart = (e: React.DragEvent, pieceId: number) => {
        e.dataTransfer.setData('pieceId', pieceId.toString());
    };

    const handleDrop = (e: React.DragEvent, targetPosition: number) => {
        e.preventDefault();
        const pieceId = parseInt(e.dataTransfer.getData('pieceId'));
        
        setPieces(prevPieces => {
            const newPieces = [...prevPieces];
            const draggedPiece = newPieces.find(p => p.id === pieceId);
            const targetPiece = newPieces.find(p => p.currentPosition === targetPosition);
            
            if (draggedPiece && targetPiece) {
                [draggedPiece.currentPosition, targetPiece.currentPosition] = 
                [targetPiece.currentPosition, draggedPiece.currentPosition];
                
                // Check if the move was incorrect
                if (draggedPiece.currentPosition !== draggedPiece.correctPosition) {
                    dispatch({ type: 'INCORRECT_MOVE' });
                }
            }
            
            return newPieces;
        });
        
        checkWinCondition();
    };

    const checkWinCondition = () => {
        const isComplete = pieces.every(piece => piece.currentPosition === piece.correctPosition);
        if (isComplete) {
            dispatch({ type: 'PUZZLE_COMPLETED' });
        }
    };

    useEffect(() => {
        if (gridSize > 0 && imageUrl) {
            initializePuzzle();
        }
    }, [gridSize, imageUrl]);

    useEffect(() => {
        if (!imageUrl) {
            setError('No image URL provided');
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageLoaded(true);
            const maxSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8, 800);
            const aspectRatio = img.width / img.height;
            
            let width, height;
            if (aspectRatio > 1) {
                width = maxSize;
                height = maxSize / aspectRatio;
            } else {
                height = maxSize;
                width = maxSize * aspectRatio;
            }
            
            // Ensure we have valid numbers
            width = Math.max(200, Math.min(800, width));
            height = Math.max(200, Math.min(800, height));
            
            setPieceSize({
                width: Math.floor(width / (gridSize || 1)),
                height: Math.floor(height / (gridSize || 1))
            });
        };
        img.onerror = () => {
            setError('Failed to load image');
            setImageLoaded(false);
        };
        img.src = imageUrl;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageUrl, gridSize]);

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 text-red-600">
                {error}
            </div>
        );
    }

    if (!imageLoaded || pieces.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center">
            {gameState.isPreviewActive && (
                <div className="absolute inset-0 z-10 bg-white rounded-lg shadow-lg">
                    <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                    />
                </div>
            )}
            
            <div 
                className="grid gap-1 bg-white rounded-lg p-4 shadow-lg"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, ${pieceSize.width}px)`,
                    width: `${pieceSize.width * gridSize}px`,
                    height: `${pieceSize.height * gridSize}px`
                }}
            >
                {pieces.map((piece) => (
                    <div
                        key={piece.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, piece.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, piece.currentPosition)}
                        className={`relative border ${
                            piece.currentPosition === piece.correctPosition 
                                ? 'border-green-500' 
                                : 'border-gray-300'
                        }`}
                        style={{
                            width: `${pieceSize.width}px`,
                            height: `${pieceSize.height}px`
                        }}
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${imageUrl})`,
                                backgroundPosition: `${-(piece.correctPosition % gridSize) * 100}% ${-Math.floor(piece.correctPosition / gridSize) * 100}%`,
                                backgroundSize: `${gridSize * 100}%`
                            }}
                        />
                    </div>
                ))}
            </div>
            
            <button
                onClick={() => dispatch({ type: 'USE_PREVIEW' })}
                disabled={gameState.previewsRemaining <= 0}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
                Preview Image ({gameState.previewsRemaining} remaining)
            </button>
        </div>
    );
};
