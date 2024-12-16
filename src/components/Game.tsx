import React, { useContext, useEffect } from 'react';
import { GameContext } from '../context/GameContext';
import { PuzzleGrid } from './PuzzleGrid';
import { Timer } from './Timer';
import { GridSizeSelector } from './GridSizeSelector';
import { GameStatus } from './GameStatus';
import { Leaderboard } from './Leaderboard';
import { Scoreboard } from './scoreboard';
import { PUZZLE_IMAGES } from '../utils/puzzleConfig';
import { StorageManager } from '../utils/storage';
import { PerformanceMonitor } from '../utils/performance';

export const Game: React.FC = () => {
    const { gameState, dispatch } = useContext(GameContext);

    // Initialize performance monitoring
    useEffect(() => {
        const monitor = PerformanceMonitor.getInstance();
        return () => monitor.stop();
    }, []);

    // Check storage limits
    useEffect(() => {
        const checkStorage = async () => {
            const usage = StorageManager.getStorageUsagePercentage();
            if (usage > 80) {
                const confirm = window.confirm(
                    'Storage space is running low. Would you like to clear old data?'
                );
                if (confirm) {
                    StorageManager.clearStorage();
                }
            }
        };
        checkStorage();
    }, []);

    const currentImage = PUZZLE_IMAGES[gameState.currentImage];

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="flex justify-between mb-4">
                        <Timer />
                        <GameStatus />
                    </div>
                    <Scoreboard
                        score={gameState.score}
                        level={gameState.level}
                        timeLeft={gameState.timeRemaining}
                        incorrectMoves={gameState.incorrectMoves}
                    />
                    <GridSizeSelector />
                    <PuzzleGrid
                        imageUrl={currentImage.url}
                        gridSize={gameState.gridSize}
                    />
                </div>
                <div>
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
}; 