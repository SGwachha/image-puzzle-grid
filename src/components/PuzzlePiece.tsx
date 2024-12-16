import React from 'react';

interface PuzzlePieceProps {
    id: number;
    imageUrl: string;
    currentPosition: number;
    correctPosition: number;
    gridSize: number;
    pieceSize: { width: number; height: number };
    onDragStart: (e: React.DragEvent, id: number) => void;
    onDrop: (e: React.DragEvent, position: number) => void;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({
    id,
    imageUrl,
    currentPosition,
    correctPosition,
    gridSize,
    pieceSize,
    onDragStart,
    onDrop
}) => {
    const calculateBackgroundPosition = () => {
        const row = Math.floor(correctPosition / gridSize);
        const col = correctPosition % gridSize;
        return `${-col * pieceSize.width}px ${-row * pieceSize.height}px`;
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, currentPosition)}
            className={`
                relative aspect-square transition-all duration-200
                ${currentPosition === correctPosition ? 'ring-2 ring-green-500' : 'ring-1 ring-gray-300'}
                ${currentPosition === correctPosition ? 'cursor-default' : 'cursor-move'}
            `}
            style={{
                width: pieceSize.width,
                height: pieceSize.height,
            }}
        >
            <div
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: calculateBackgroundPosition(),
                    backgroundSize: `${pieceSize.width * gridSize}px ${pieceSize.height * gridSize}px`
                }}
            />
        </div>
    );
}; 