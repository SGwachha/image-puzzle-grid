import React, { createContext, useContext, useState, useEffect } from 'react';
import { hashPassword, createSession, validateSession, clearSession } from '../utils/auth.ts';

interface User {
    id: string;
    username: string;
}

interface UserCredentials {
    username: string;
    passwordHash: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkSession = () => {
            if (!validateSession()) {
                setUser(null);
                return;
            }

            const sessionData = sessionStorage.getItem('puzzleGameSession');
            if (sessionData) {
                const { userId } = JSON.parse(sessionData);
                const users = JSON.parse(localStorage.getItem('users') || '{}');
                const userCredentials = users[userId];
                if (userCredentials) {
                    setUser({ id: userId, username: userCredentials.username });
                }
            }
        };

        checkSession();
        window.addEventListener('focus', checkSession);
        return () => window.removeEventListener('focus', checkSession);
    }, []);

    const register = async (username: string, password: string): Promise<boolean> => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            // Check if username is taken
            const isUsernameTaken = Object.values(users).some(
                (user: any) => user.username.toLowerCase() === username.toLowerCase()
            );
            
            if (isUsernameTaken) {
                setError('Username is already taken');
                return false;
            }

            const userId = `user_${Date.now()}`;
            const passwordHash = hashPassword(password);

            // Store user credentials
            users[userId] = {
                username,
                passwordHash
            };
            localStorage.setItem('users', JSON.stringify(users));
            setError(null);
            return true;
        } catch (err) {
            setError('Registration failed');
            return false;
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            const passwordHash = hashPassword(password);

            // Find user by username and password
            const userId = Object.keys(users).find(id => {
                const user = users[id] as UserCredentials;
                return user.username.toLowerCase() === username.toLowerCase() &&
                       user.passwordHash === passwordHash;
            });

            if (!userId) {
                setError('Invalid username or password');
                return false;
            }
            const sessionToken = createSession(userId);
            setUser({ id: userId, username: users[userId].username });
            setError(null);
            return true;
        } catch (err) {
            setError('Login failed');
            return false;
        }
    };

    const logout = () => {
        clearSession();
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 