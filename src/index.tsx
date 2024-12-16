import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { PerformanceProvider } from './context/PerformanceContext.tsx';
import { LeaderboardProvider } from './context/LeaderboardContext.tsx';
import App from './App.tsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <PerformanceProvider>
                    <LeaderboardProvider>
                        <App />
                    </LeaderboardProvider>
                </PerformanceProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);