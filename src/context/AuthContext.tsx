import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageManager } from '../utils/storage.ts';
import { hashPassword } from '../utils/security.ts';

interface User {
    id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string) => Promise<{ success: true, message: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState({
        user: null as User | null,
        isAuthenticated: false,
        isInitialized: false,
        isLoading: true
    });

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const session = StorageManager.getItem<User>('userSession', sessionStorage);
                if (session) {
                    setState(prev => ({
                        ...prev,
                        user: session,
                        isAuthenticated: true,
                        isInitialized: true,
                        isLoading: false
                    }));
                } else {
                    setState(prev => ({
                        ...prev,
                        user: null,
                        isAuthenticated: false,
                        isInitialized: true,
                        isLoading: false
                    }));
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                StorageManager.removeItem('userSession', sessionStorage);
                setState(prev => ({
                    ...prev,
                    user: null,
                    isAuthenticated: false,
                    isInitialized: true,
                    isLoading: false
                }));
            }
        };

        initializeAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const hashedPassword = hashPassword(password);
            const users = StorageManager.getItem<Array<{
                username: string;
                password: string;
                id: string;
            }>>('users') || [];

            const foundUser = users.find(u => u.username === username && u.password === hashedPassword);
            if (!foundUser) {
                throw new Error('Invalid credentials');
            }

            const userSession = { id: foundUser.id, username: foundUser.username };
            await StorageManager.setItem('userSession', userSession, sessionStorage);
            
            setState(prev => ({
                ...prev,
                user: userSession,
                isAuthenticated: true,
                isLoading: false
            }));
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            throw new Error('Invalid username or password');
        }
    };

    const signup = async (username: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true }));
        try {
            if (!username || !password) {
                throw new Error('Username and password are required');
            }

            const users = StorageManager.getItem<Array<{
                username: string;
                password: string;
                id: string;
            }>>('users') || [];

            if (users.some(u => u.username === username)) {
                throw new Error('Username already exists');
            }

            const newUser = {
                id: Date.now().toString(),
                username,
                password: hashPassword(password)
            };

            users.push(newUser);
            await StorageManager.setItem('users', users);
            
            setState(prev => ({ ...prev, isLoading: false }));
            return { success: true, message: 'Registration successful! Please login.' };
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false }));
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Error during signup');
        }
    };

    const logout = () => {
        setState(prev => ({ ...prev, isLoading: true }));
        StorageManager.removeItem('userSession', sessionStorage);
        setState({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
            isLoading: false
        });
    };

    if (!state.isInitialized) {
        return null;
    }

    return (
        <AuthContext.Provider 
            value={{ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated, 
                isInitialized: state.isInitialized,
                isLoading: state.isLoading,
                login, 
                signup, 
                logout 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}; 