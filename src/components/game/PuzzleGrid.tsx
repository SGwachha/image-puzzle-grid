import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { 
    generatePuzzlePieces, 
    shufflePieces, 
    validatePiecePosition,
    calculatePieceDimensions 
} from '../../utils/puzzle.ts';

const PuzzleGrid: React.FC = () => {
    const { state, dispatch } = useGame();
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Calculate and update dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions(calculatePieceDimensions(state.currentGrid, width));
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [state.currentGrid]);

    // Handle drag start with offset calculation
    const handleDragStart = (pieceId: number, e: React.DragEvent) => {
        const element = e.currentTarget as HTMLElement;
        const rect = element.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setDraggedPiece(pieceId);
        e.dataTransfer.setDragImage(new Image(), 0, 0);
    };

    // Handle drag over with custom positioning
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (draggedPiece === null) return;

        const element = e.currentTarget as HTMLElement;
        if (element) {
            const rect = element.getBoundingClientRect();
            element.style.transform = `translate(${e.clientX - rect.left - dragOffset.x}px, ${e.clientY - rect.top - dragOffset.y}px)`;
        }
    }, [draggedPiece, dragOffset]);

    // Handle drop with snapping animation
    const handleDrop = useCallback((targetPosition: number) => {
        if (draggedPiece === null) return;

        const piece = state.pieces.find(p => p.id === draggedPiece);
        if (!piece) return;

        const isCorrect = validatePiecePosition(piece, targetPosition);
        
        // Reset transform for snapping animation
        const elements = document.querySelectorAll('.puzzle-piece');
        elements.forEach(el => {
            (el as HTMLElement).style.transform = '';
        });

        dispatch({
            type: 'MOVE_PIECE',
            pieceId: draggedPiece,
            newPosition: targetPosition,
            isCorrect
        });

        if (!isCorrect) {
            dispatch({ type: 'RECORD_INCORRECT_MOVE' });
        }

        setDraggedPiece(null);
        checkPuzzleCompletion();
    }, [draggedPiece, dispatch]);

    // Check puzzle completion
    const checkPuzzleCompletion = useCallback(() => {
        const isComplete = state.pieces.every(piece => 
            piece.currentPosition === piece.correctPosition
        );

        if (isComplete) {
            dispatch({ type: 'COMPLETE_PUZZLE' });
        }
    }, [state.pieces, dispatch]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full max-w-3xl mx-auto aspect-square bg-gray-100 rounded-lg shadow-lg"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${state.currentGrid}, 1fr)`,
                gap: '2px',
                padding: '2px'
            }}
        >
            {state.pieces.map((piece) => {
                const currentPiece = state.pieces.find(p => p.currentPosition === piece.id);
                if (!currentPiece) return null;

                return (
                    <div
                        key={piece.id}
                        draggable
                        onDragStart={(e) => handleDragStart(currentPiece.id, e)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(piece.id)}
                        className={`
                            puzzle-piece relative aspect-square
                            ${currentPiece.isCorrect 
                                ? 'border-2 border-green-500' 
                                : 'border border-gray-300'}
                            cursor-move hover:opacity-90
                            transition-all duration-200 ease-in-out
                            ${draggedPiece === currentPiece.id ? 'z-10 opacity-90' : 'z-0'}
                        `}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${currentPiece.imageUrl})`,
                                backgroundPosition: `${currentPiece.backgroundPosition.x}% ${currentPiece.backgroundPosition.y}%`,
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