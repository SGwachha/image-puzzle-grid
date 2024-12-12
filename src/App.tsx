import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext.tsx';
import PuzzleGrid from './components/puzzleGrid.tsx';
import Timer from './components/timer.tsx';
import Scoreboard from './components/scoreboard.tsx';
import ImagePreview from './components/imagePreview.tsx';
import Login from './components/authentication/login.tsx';
import Signup from './components/authentication/signup.tsx';
import { useAuth } from './hooks/useAuth.ts';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const GameLayout: React.FC = () => {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Puzzle Game</h1>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <Timer />
                        <Scoreboard />
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <PuzzleGrid />
                    </div>
                    <div className="mt-4">
                        <ImagePreview />
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <GameProvider>
                            <GameLayout />
                        </GameProvider>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
