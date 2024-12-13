/**
 * React Dependencies
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

/**
 * Internal Dependencies
 */
import { GameProvider } from './context/GameContext.tsx';
import { LeaderboardProvider } from './context/LeaderboardContext.tsx';
import { PerformanceProvider } from './context/PerformanceContext.tsx';
import Login from './components/authentication/login.tsx';
import Signup from './components/authentication/signup.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import { useAuth } from './hooks/useAuth.ts';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <PerformanceProvider>
            <LeaderboardProvider>
                <Routes>
                    <Route path="/signup" element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    } />
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <GameProvider>
                                <Dashboard />
                            </GameProvider>
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={
                        <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                    } />
                    <Route path="*" element={
                        <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
                    } />
                </Routes>
            </LeaderboardProvider>
        </PerformanceProvider>
    );
}

export default App;
