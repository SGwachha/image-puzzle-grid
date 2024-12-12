import { useState, useEffect } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
            setUser(JSON.parse(sessionUser));
            setIsAuthenticated(true);
            navigate('/');
        }
    }, [navigate]);

    const login = (username: string, password: string) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: { username: string; hashedPassword: string }) => 
            u.username === username && u.hashedPassword === password
        );

        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setIsAuthenticated(true);
            navigate('/', { replace: true });
            return true;
        }
        return false;
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    return { isAuthenticated, user, login, logout };
};

// Simple hash function (replace with more secure version in production)
const hashPassword = (password: string): string => {
    return password.split('').reduce((hash, char) => {
        return ((hash << 5) - hash) + char.charCodeAt(0) | 0;
    }, 0).toString(16);
}; 