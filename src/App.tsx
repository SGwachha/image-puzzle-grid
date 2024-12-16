/**
 * React Dependencies
 */
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

/**
 * Internal Dependencies
 */
import { GameProvider } from './context/GameContext.tsx';
import Login from './components/authentication/login.tsx';
import Signup from './components/authentication/signup.tsx';
import { Dashboard } from './components/dashboard/Dashboard.tsx';
import { useAuth } from './context/AuthContext.tsx';

const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

function App() {
    const { isAuthenticated, isInitialized, isLoading } = useAuth();

    if (!isInitialized || isLoading) {
        return <LoadingSpinner />;
    }

    return (
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
            <Route path="/dashboard/*" element={
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
    );
}

export default App;