import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { 
    hashPassword, 
    createSession, 
    validateSession, 
    extendSession, 
    clearSession,
    encryptData,
    decryptData 
} from '../utils/security.ts';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

export const useAuth = () => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        error: null
    });
    const navigate = useNavigate();

    // Check session on mount and set up interval for validation
    useEffect(() => {
        const checkSession = () => {
            if (!validateSession()) {
                setState(prev => ({
                    ...prev,
                    user: null,
                    isLoading: false
                }));
                navigate('/login');
                return;
            }
            extendSession();
        };

        checkSession();
        const interval = setInterval(checkSession, 60000);

        return () => clearInterval(interval);
    }, [navigate]);

    const login = async (username: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const encryptedUsers = localStorage.getItem('users');
            const users: User[] = encryptedUsers 
                ? JSON.parse(decryptData(encryptedUsers))
                : [];

            const user = users.find(u => u.username === username);
            if (!user || user.hashedPassword !== hashPassword(password)) {
                throw new Error('Invalid username or password');
            }

            createSession(user);

            setState({
                user,
                isLoading: false,
                error: null
            });

            navigate('/dashboard');
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed'
            }));
        }
    };

    const register = async (username: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const encryptedUsers = localStorage.getItem('users');
            const users: User[] = encryptedUsers 
                ? JSON.parse(decryptData(encryptedUsers))
                : [];

            if (users.some(u => u.username === username)) {
                throw new Error('Username already exists');
            }

            const newUser: User = {
                id: Date.now().toString(),
                username,
                hashedPassword: hashPassword(password),
                currentScore: 0,
                highestScore: 0,
                currentLevel: 1
            };

            const updatedUsers = [...users, newUser];
            localStorage.setItem('users', encryptData(JSON.stringify(updatedUsers)));

            createSession(newUser);

            setState({
                user: newUser,
                isLoading: false,
                error: null
            });

            navigate('/dashboard');
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Registration failed'
            }));
        }
    };

    const logout = () => {
        clearSession();
        setState({
            user: null,
            isLoading: false,
            error: null
        });
        navigate('/login');
    };

    return {
        ...state,
        login,
        register,
        logout
    };
}; 