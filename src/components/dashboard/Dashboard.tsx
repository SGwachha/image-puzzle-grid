import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useGame } from '../../context/GameContext.tsx';
import { PuzzleGrid } from '../puzzleGrid.tsx';
import { Timer } from '../timer.tsx';
import { Scoreboard } from '../scoreboard.tsx';
import { Leaderboard } from '../Leaderboard.tsx';
import { PerformanceMonitor } from '../PerformanceMonitor.tsx';
import { GridSizeSelector } from '../GridSizeSelector.tsx';
import { ImagePreview } from '../imagePreview.tsx';
import { PUZZLE_IMAGES } from '../../utils/puzzleConfig.ts';

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { gameState } = useGame();

    const currentImage = PUZZLE_IMAGES[gameState.currentImage % PUZZLE_IMAGES.length];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {user?.username}
                    </h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Game Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <GridSizeSelector />
                            <PuzzleGrid 
                                imageUrl={currentImage.url}
                                gridSize={gameState.gridSize}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <Timer />
                            <ImagePreview />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Scoreboard 
                            score={gameState.score}
                            level={gameState.level}
                            timeLeft={gameState.timeRemaining}
                            incorrectMoves={gameState.incorrectMoves}
                        />
                        <Leaderboard />
                    </div>
                </div>
            </main>

            {/* Performance Monitor */}
            {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
        </div>
    );
}; 