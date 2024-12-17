import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { GameProvider } from './context/GameContext.tsx';
import { LeaderboardProvider } from './context/LeaderboardContext.tsx';
import { Timer } from './components/Timer.tsx';
import { PuzzleGrid } from './components/PuzzleGrid.tsx';
import { DifficultySelector } from './components/DifficultySelector.tsx';
import { Leaderboard } from './components/Leaderboard.tsx';
import { Login } from './components/Login.tsx';
import { PerformanceMonitor } from './components/PerformanceMonitor.tsx';
import { StorageMonitor } from './components/StorageMonitor.tsx';

// Separate the game content
const GameContent: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Puzzle Challenge
                    </h1>
                    <p className="text-gray-600">
                        Complete the puzzle before time runs out!
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <Timer />
                        <DifficultySelector />
                        <Leaderboard />
                    </div>
                    <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-4">
                        <PuzzleGrid />
                    </div>
                </div>

                <footer className="mt-8 text-center text-gray-600 text-sm">
                    <p>Drag and drop the pieces to solve the puzzle.</p>
                    <p>Time penalties apply for incorrect moves!</p>
                </footer>
            </div>
            <PerformanceMonitor />
            <StorageMonitor />
        </div>
    );
};

// Main app content with authentication check
const AppContent: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return user ? <GameContent /> : <Login />;
};

// Root component with providers
const App: React.FC = () => {
    return (
        <AuthProvider>
            <LeaderboardProvider>
                <GameProvider>
                    <AppContent />
                </GameProvider>
            </LeaderboardProvider>
        </AuthProvider>
    );
};

export default App;