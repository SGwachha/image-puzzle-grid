import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '../types';
import { 
    hashPassword, 
    encryptData, 
    decryptData, 
    createSession, 
    validateSession, 
    getSessionUser 
} from '../utils/security.ts';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return validateSession();
    });
    const [user, setUser] = useState<User | null>(() => {
        return getSessionUser();
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const login = async (username: string, password: string) => {
        try {
            const hashedPassword = hashPassword(password);
            const encryptedUsers = localStorage.getItem('users');
            let users = [];
            
            if (encryptedUsers) {
                const decryptedUsers = decryptData(encryptedUsers);
                users = Array.isArray(decryptedUsers) ? decryptedUsers : [];
            }

            const user = users.find((u: { username: string; hashedPassword: string }) => 
                u.username === username && u.hashedPassword === hashedPassword
            );

            if (user) {
                createSession(user);
                setUser(user);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const register = (username: string, password: string) => {
        try {
            const hashedPassword = hashPassword(password);
            const encryptedUsers = localStorage.getItem('users');
            let users = [];

            if (encryptedUsers) {
                const decryptedUsers = decryptData(encryptedUsers);
                users = Array.isArray(decryptedUsers) ? decryptedUsers : [];
            }

            if (users.some((u: { username: string }) => u.username === username)) {
                return false;
            }

            const newUser = {
                id: Date.now().toString(),
                username,
                hashedPassword,
                currentScore: 0,
                highestScore: 0,
                currentLevel: 1
            };

            users.push(newUser);
            localStorage.setItem('users', encryptData(users));
            return true;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    };

    const logout = () => {
        try {
            sessionStorage.removeItem('userSession');
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return { isAuthenticated, user, login, register, logout };
}; 