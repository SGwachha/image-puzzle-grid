/*
React Dependencies
*/
import React, { useState, useEffect } from 'react';

/*
Internal Dependencies
*/
import { useGame } from '../context/GameContext.tsx';
import { PuzzlePiece } from '../types';
import { getRandomPuzzleImage, PuzzleImage } from '../config/images.ts';

const PuzzleGrid: React.FC = () => {
    const { state, dispatch } = useGame();
    const [currentImage, setCurrentImage] = useState<PuzzleImage | null>(null);
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);

    const createPuzzlePieces = (image: PuzzleImage) => {
        const gridSize = state.currentGrid;
        const totalPieces = gridSize * gridSize;
        const newPieces: PuzzlePiece[] = [];

        for (let i = 0; i < totalPieces; i++) {
            newPieces.push({
                id: i,
                currentPosition: i,
                correctPosition: i,
                imageUrl: image.url
            });
        }

        // One piece will be empty for sliding
        const shuffledPieces = shufflePieces(newPieces.slice(0, -1));
        return [...shuffledPieces, newPieces[newPieces.length - 1]];
    };

    const shufflePieces = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
        const shuffled = [...pieces];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
            [shuffled[j].currentPosition, shuffled[i].currentPosition];
        }
        return shuffled;
    };

    useEffect(() => {
        const image = getRandomPuzzleImage();
        setCurrentImage(image);
        const initialPieces = createPuzzlePieces(image);
        setPieces(initialPieces);
        dispatch({ 
            type: 'SET_CURRENT_IMAGE', 
            payload: {
                url: image.url,
                details: {
                    name: image.name,
                    difficulty: 'medium',
                    category: 'general'
                }
            }
        });
    }, [dispatch, state.currentGrid]);

    const getPieceStyle = (piece: PuzzlePiece) => {
        const gridSize = state.currentGrid;
        const row = Math.floor(piece.correctPosition / gridSize);
        const col = piece.correctPosition % gridSize;
        
        return {
            backgroundImage: `url(${piece.imageUrl})`,
            backgroundSize: `${gridSize * 100}%`,
            backgroundPosition: `-${col * (100 / (gridSize - 1))}% -${row * (100 / (gridSize - 1))}%`,
            width: '100%',
            paddingBottom: '100%',
            position: 'relative',
            border: '1px solid #ccc',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
        };
    };

    const handlePieceMove = (clickedIndex: number) => {
        if (!state.isGameStarted) {
            dispatch({ type: 'START_GAME' });
        }

        const emptyIndex = pieces.findIndex(p => p.id === pieces.length - 1);
        const clickedPiece = pieces.find(p => p.currentPosition === clickedIndex);
        
        if (!clickedPiece || !isAdjacent(clickedIndex, emptyIndex)) return;

        setPieces(currentPieces => {
            const newPieces = [...currentPieces];
            const emptyPiece = newPieces.find(p => p.id === pieces.length - 1)!;
            const clickedPiece = newPieces.find(p => p.currentPosition === clickedIndex)!;
            
            [clickedPiece.currentPosition, emptyPiece.currentPosition] = 
            [emptyPiece.currentPosition, clickedPiece.currentPosition];

            if (isPuzzleSolved(newPieces)) {
                setTimeout(() => {
                    alert('Congratulations! Puzzle solved!');
                }, 100);
            }

            return newPieces;
        });
    };

    const isAdjacent = (pos1: number, pos2: number): boolean => {
        const gridSize = state.currentGrid;
        const row1 = Math.floor(pos1 / gridSize);
        const col1 = pos1 % gridSize;
        const row2 = Math.floor(pos2 / gridSize);
        const col2 = pos2 % gridSize;

        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    };

    const isPuzzleSolved = (currentPieces: PuzzlePiece[]): boolean => {
        return currentPieces.every(piece => 
            piece.currentPosition === piece.correctPosition
        );
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${state.currentGrid}, 1fr)`,
        gap: '2px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        aspectRatio: '1',
        border: '2px solid #333',
        padding: '2px',
        backgroundColor: '#f0f0f0'
    };

    return (
        <div className="w-full p-4">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold">Sliding Puzzle</h2>
                <p className="text-gray-600">Click tiles to move them into the empty space</p>
            </div>
            <div style={gridStyle}>
                {Array(state.currentGrid * state.currentGrid).fill(null).map((_, index) => {
                    const piece = pieces.find(p => p.currentPosition === index);
                    const isEmpty = piece?.id === pieces.length - 1;

                    return (
                        <div
                            key={index}
                            onClick={() => handlePieceMove(index)}
                            className={`relative ${isEmpty ? 'bg-gray-200' : ''} hover:opacity-90`}
                            style={!isEmpty && piece ? getPieceStyle(piece) : {
                                paddingBottom: '100%',
                                backgroundColor: '#e0e0e0',
                                border: '1px solid #ccc'
                            }}
                        >
                            {!isEmpty && piece && (
                                <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white px-2 rounded">
                                    {piece.id + 1}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {!state.isGameStarted && (
                <div className="text-center mt-4 text-gray-600">
                    Click any piece next to the empty space to start
                </div>
            )}
        </div>
    );
};

export default PuzzleGrid;
