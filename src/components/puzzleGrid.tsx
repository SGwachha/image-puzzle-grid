import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext.tsx';
import { GridSizeSelector } from './GridSizeSelector.tsx';
import { ImagePreview } from './ImagePreview.tsx';
import { PerformanceMonitor } from './PerformanceMonitor.tsx';
import { SecureStorage } from '../utils/encryption.ts';

const PUZZLE_IMAGES = [
    '/images/cat.jpg',
    '/images/forest.webp',
    '/images/sky.webp',
    '/images/sunsetTree.jpg',
    '/images/waterfall.webp',
    '/images/moon.jpg',
    '/images/boat.jpg',
    '/images/panda.jpg',
    '/images/flower.jpg',
    '/images/mountain.jpg',
];

interface PuzzlePiece {
    id: number;
    currentPosition: number;
    correctPosition: number;
    isEmpty: boolean;
}

interface DragState {
    isDragging: boolean;
    draggedPieceId: number | null;
}

export const PuzzleGrid: React.FC = () => {
    const { 
        gridSize, 
        setGridSize,
        currentImage,
        setCurrentImage,
        points,
        setPoints,
        incorrectMoves,
        setIncorrectMoves,
        timeRemaining,
        setTimeRemaining,
        gameStatus,
        setGameStatus,
        calculateScore
    } = useGame();

    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [emptyPosition, setEmptyPosition] = useState<number>(0);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [pieceSize, setPieceSize] = useState({ width: 400, height: 400 });
    const [error, setError] = useState<string | null>(null);
    const [completedPuzzles, setCompletedPuzzles] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedPieceId: null
    });

    // puzzle pieces
    const initializePuzzle = useCallback(() => {
        const totalPieces = gridSize * gridSize;
        const newPieces: PuzzlePiece[] = Array.from({ length: totalPieces }, (_, index) => ({
            id: index,
            currentPosition: index,
            correctPosition: index,
            isEmpty: index === totalPieces - 1
        }));

        // Shuffle pieces
        for (let i = newPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = newPieces[i].currentPosition;
            newPieces[i].currentPosition = newPieces[j].currentPosition;
            newPieces[j].currentPosition = temp;

            if (newPieces[i].isEmpty) {
                setEmptyPosition(newPieces[j].currentPosition);
            } else if (newPieces[j].isEmpty) {
                setEmptyPosition(newPieces[i].currentPosition);
            }
        }

        setPieces(newPieces);
    }, [gridSize]);

    // Load and handle image
    useEffect(() => {
        if (!imageUrl && !currentImage) {
            setImageUrl(PUZZLE_IMAGES[0]);
            return;
        }

        setImageLoaded(false);
        const img = new Image();
        
        img.onload = () => {
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
            
            setPieceSize({
                width: Math.floor(width / gridSize),
                height: Math.floor(height / gridSize)
            });
            setImageLoaded(true);
        };

        img.onerror = () => {
            setError('Failed to load image');
            setImageLoaded(false);
        };

        const imageToLoad = imageUrl || currentImage || PUZZLE_IMAGES[0];
        img.src = imageToLoad;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageUrl, currentImage, gridSize]);

    useEffect(() => {
        const initializeFirstImage = () => {
            if (!currentImage && !imageUrl) {
                const firstImage = PUZZLE_IMAGES[0];
                setImageUrl(firstImage);
                setCurrentImage(firstImage);
            }
        };

        initializeFirstImage();
    }, []);

    // puzzle when grid size changes
    useEffect(() => {
        const initializeNewPuzzle = () => {
            if (gridSize > 0) {
                initializePuzzle();
                const baseTime = 300;
                const levelPenalty = 30 * Math.floor((gridSize - 2) / 2);
                const initialTime = Math.max(60, baseTime - levelPenalty);
                setTimeRemaining(initialTime);
                setGameStatus('playing');
            }
        };

        initializeNewPuzzle();
    }, [gridSize]);

    // Load game state
    useEffect(() => {
        const loadSavedState = () => {
            try {
                const savedState = SecureStorage.getItem(localStorage, 'puzzleGameState');
                if (!savedState) {
                    initializePuzzle();
                    return;
                }

                if (typeof savedState === 'object' &&
                    Array.isArray(savedState.pieces) &&
                    typeof savedState.emptyPosition === 'number' &&
                    typeof savedState.gridSize === 'number' &&
                    typeof savedState.currentImage === 'string' &&
                    typeof savedState.points === 'number' &&
                    typeof savedState.incorrectMoves === 'number' &&
                    typeof savedState.timeRemaining === 'number' &&
                    typeof savedState.completedPuzzles === 'number' &&
                    typeof savedState.currentImageIndex === 'number'
                ) {
                    setPieces(savedState.pieces);
                    setEmptyPosition(savedState.emptyPosition);
                    setGridSize(savedState.gridSize);
                    setCurrentImage(savedState.currentImage);
                    setPoints(savedState.points);
                    setIncorrectMoves(savedState.incorrectMoves);
                    setTimeRemaining(savedState.timeRemaining);
                    setCompletedPuzzles(savedState.completedPuzzles);
                    setCurrentImageIndex(savedState.currentImageIndex);
                    setGameStatus('playing');
                } else {
                    console.warn('Invalid saved state structure');
                    SecureStorage.removeItem(localStorage, 'puzzleGameState');
                    initializePuzzle();
                }
            } catch (error) {
                console.error('Failed to load game state:', error);
                SecureStorage.removeItem(localStorage, 'puzzleGameState');
                initializePuzzle();
            }
        };

        loadSavedState();
    }, []);

    // Save game state
    useEffect(() => {
        if (!imageLoaded || pieces.length === 0) return;

        const saveTimeout = setTimeout(() => {
            const gameState = {
                pieces,
                emptyPosition,
                gridSize,
                currentImage,
                points,
                incorrectMoves,
                timeRemaining,
                completedPuzzles,
                currentImageIndex
            };

            try {
                SecureStorage.setItem(localStorage, 'puzzleGameState', gameState);
            } catch (error) {
                console.error('Failed to save game state:', error);
                SecureStorage.removeItem(localStorage, 'puzzleGameState');
            }
        }, 500);

        return () => clearTimeout(saveTimeout);
    }, [pieces, emptyPosition, gridSize, currentImage, points, incorrectMoves, timeRemaining, completedPuzzles, currentImageIndex, imageLoaded]);

    // Select next images
    const selectNextImage = useCallback(() => {
        const nextIndex = (currentImageIndex + 1) % PUZZLE_IMAGES.length;
        setCurrentImageIndex(nextIndex);
        const newImage = PUZZLE_IMAGES[nextIndex];
        setImageUrl(newImage);
        setCurrentImage(newImage);
        return newImage;
    }, [currentImageIndex, setCurrentImage]);

    // next level
    const progressToNextLevel = useCallback(() => {
        if (completedPuzzles >= PUZZLE_IMAGES.length - 1) {
            setGameStatus('excellent');
            return;
        }

        const newGridSize = Math.min(gridSize + 2, 12);
        const baseTime = 300
        const levelPenalty = 30 * Math.floor((newGridSize - 2) / 2);
        const newTime = Math.max(60, baseTime - levelPenalty);

        setGridSize(newGridSize);
        selectNextImage();
        setCompletedPuzzles(prev => prev + 1);
        setIncorrectMoves(0);
        setTimeRemaining(newTime);
        setGameStatus('playing');
    }, [completedPuzzles, gridSize, selectNextImage, setGameStatus, setGridSize, setIncorrectMoves, setTimeRemaining]);

    const isAdjacent = (pos1: number, pos2: number): boolean => {
        const row1 = Math.floor(pos1 / gridSize);
        const col1 = pos1 % gridSize;
        const row2 = Math.floor(pos2 / gridSize);
        const col2 = pos2 % gridSize;

        return (
            (Math.abs(row1 - row2) === 1 && col1 === col2) ||
            (Math.abs(col1 - col2) === 1 && row1 === row2)
        );
    };

    const handleDragStart = (e: React.DragEvent, piece: PuzzlePiece) => {
        if (piece.isEmpty) return;
        
        e.dataTransfer.setData('text/plain', piece.id.toString());
        setDragState({
            isDragging: true,
            draggedPieceId: piece.id
        });

        // Create a drag preview
        const dragPreview = document.createElement('div');
        dragPreview.style.width = `${pieceSize.width}px`;
        dragPreview.style.height = `${pieceSize.height}px`;
        dragPreview.style.backgroundImage = `url(${imageUrl})`;
        dragPreview.style.backgroundPosition = `${-piece.correctPosition % gridSize * pieceSize.width}px ${-Math.floor(piece.correctPosition / gridSize) * pieceSize.height}px`;
        dragPreview.style.backgroundSize = `${pieceSize.width * gridSize}px ${pieceSize.height * gridSize}px`;
        dragPreview.style.opacity = '0.8';
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, pieceSize.width / 2, pieceSize.height / 2);
        setTimeout(() => document.body.removeChild(dragPreview), 0);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetPosition: number) => {
        e.preventDefault();
        const draggedPieceId = parseInt(e.dataTransfer.getData('text/plain'));
        
        setPieces(prevPieces => {
            const newPieces = [...prevPieces];
            const draggedPiece = newPieces.find(p => p.id === draggedPieceId);
            const targetPiece = newPieces.find(p => p.currentPosition === targetPosition);

            if (!draggedPiece || !targetPiece) return prevPieces;

            // Swap positions
            const tempPosition = draggedPiece.currentPosition;
            draggedPiece.currentPosition = targetPiece.currentPosition;
            targetPiece.currentPosition = tempPosition;

            // Check if move was incorrect
            if (draggedPiece.currentPosition !== draggedPiece.correctPosition) {
                setIncorrectMoves(prev => prev + 1);
                setTimeRemaining(prev => Math.max(0, prev - 10));
            }

            if (targetPiece.isEmpty) {
                setEmptyPosition(tempPosition);
            }

            return newPieces;
        });

        setDragState({
            isDragging: false,
            draggedPieceId: null
        });

        checkWinCondition();
    };

    const handleDragEnd = () => {
        setDragState({
            isDragging: false,
            draggedPieceId: null
        });
    };

    const checkWinCondition = () => {
        const isComplete = pieces.every(piece => piece.currentPosition === piece.correctPosition);
        if (isComplete) {
            calculateScore();
            
            // next level after a short delay
            setTimeout(progressToNextLevel, 1000);
        }
    };

    // Render puzzle piece
    const renderPuzzlePiece = useCallback((piece: PuzzlePiece) => {
        if (piece.isEmpty) {
            return null;
        }

        const row = Math.floor(piece.correctPosition / gridSize);
        const col = piece.correctPosition % gridSize;
        const backgroundX = -col * pieceSize.width;
        const backgroundY = -row * pieceSize.height;

        return (
            <div 
                className="absolute inset-0 bg-cover bg-no-repeat"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${backgroundX}px ${backgroundY}px`,
                    backgroundSize: `${pieceSize.width * gridSize}px ${pieceSize.height * gridSize}px`,
                    transition: 'transform 0.2s ease-in-out'
                }}
            />
        );
    }, [gridSize, imageUrl, pieceSize.width, pieceSize.height]);

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (!imageLoaded) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col items-center">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold">Level {Math.floor((gridSize - 2) / 2) + 1}</h2>
                <GridSizeSelector />
                <p className="text-sm text-gray-600">Grid Size: {gridSize}x{gridSize}</p>
                <p className="text-sm text-gray-600">Puzzles Completed: {completedPuzzles}/{PUZZLE_IMAGES.length}</p>
                <p className="text-sm text-gray-600">Current Image: {currentImageIndex + 1}/10</p>
                
                {gameStatus && gameStatus !== 'playing' && (
                    <div className={`mt-2 font-bold ${
                        gameStatus === 'excellent' ? 'text-green-500' :
                        gameStatus === 'good' ? 'text-blue-500' :
                        gameStatus === 'canDoBetter' ? 'text-yellow-500' :
                        'text-red-500'
                    }`}>
                        Rating: {gameStatus}
                    </div>
                )}
                
                {incorrectMoves > 0 && (
                    <p className="text-sm text-red-500">
                        Time Penalty: -{incorrectMoves * 10}s
                    </p>
                )}
                <ImagePreview imageUrl={imageUrl} />
            </div>

            <div 
                className="grid gap-1 bg-gray-100 p-4 rounded-lg"
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, ${pieceSize.width}px)`,
                    width: `${pieceSize.width * gridSize}px`,
                    height: `${pieceSize.height * gridSize}px`
                }}
            >
                {imageLoaded && pieces.map((piece) => (
                    <div
                        key={piece.id}
                        draggable={!piece.isEmpty}
                        onDragStart={(e) => handleDragStart(e, piece)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, piece.currentPosition)}
                        onDragEnd={handleDragEnd}
                        className={`relative ${
                            piece.isEmpty ? 'bg-gray-300' :
                            piece.currentPosition === piece.correctPosition ? 'border-2 border-green-500' : 'border border-gray-300'
                        } cursor-move transition-all duration-200 ${
                            dragState.isDragging && dragState.draggedPieceId === piece.id ? 'opacity-50' : ''
                        }`}
                        style={{
                            gridColumn: (piece.currentPosition % gridSize) + 1,
                            gridRow: Math.floor(piece.currentPosition / gridSize) + 1,
                            width: `${pieceSize.width}px`,
                            height: `${pieceSize.height}px`,
                            transform: dragState.isDragging && dragState.draggedPieceId === piece.id ? 'scale(0.95)' : 'scale(1)'
                        }}
                    >
                        {renderPuzzlePiece(piece)}
                    </div>
                ))}
            </div>

            <PerformanceMonitor />

            {/* Storage usage warning */}
            {(() => {
                const { used, total } = SecureStorage.getStorageUsage(localStorage);
                const usagePercentage = (used / total) * 100;
                if (usagePercentage > 80) {
                    return (
                        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                            Storage usage: {Math.round(usagePercentage)}%
                            <button
                                onClick={() => SecureStorage.clear(localStorage)}
                                className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Clear Storage
                            </button>
                        </div>
                    );
                }
                return null;
            })()}
        </div>
    );
};
