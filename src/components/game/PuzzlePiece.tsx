import React, { memo } from 'react';
import { PuzzlePiece as PuzzlePieceType } from '../../types';

interface PuzzlePieceProps {
    piece: PuzzlePieceType;
    isCorrect: boolean;
    isDragging: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
}

const PuzzlePiece: React.FC<PuzzlePieceProps> = memo(({
    piece,
    isCorrect,
    isDragging,
    onDragStart,
    onDragOver,
    onDrop
}) => {
    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`
                puzzle-piece relative aspect-square
                ${isCorrect ? 'border-2 border-green-500' : 'border border-gray-300'}
                cursor-move hover:opacity-90
                transition-all duration-200 ease-in-out
                ${isDragging ? 'z-10 opacity-90' : 'z-0'}
            `}
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${piece.imageUrl})`,
                    backgroundPosition: `${piece.backgroundPosition.x}% ${piece.backgroundPosition.y}%`,
                    backgroundSize: `${piece.gridSize * 100}%`
                }}
            />
        </div>
    );
});

PuzzlePiece.displayName = 'PuzzlePiece';

export default PuzzlePiece; 