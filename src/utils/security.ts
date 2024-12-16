/*
Security Utilities
*/
import { StorageManager } from './storage.ts';

const HASH_SALT = 'puzzle-game-salt';

export interface User {
    id: string;
    username: string;
}

export interface Session {
    userId: string;
    expiresAt: number;
    token: string;
}

export const hashPassword = (password: string): string => {
    // Simple custom hashing function
    let hash = 0;
    const combinedString = HASH_SALT + password;
    
    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    return hash.toString(36);
};

export const createSession = (user: User): Session => {
    const session: Session = {
        userId: user.id,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000),
        token: hashPassword(user.id + Date.now().toString())
    };
    
    StorageManager.setItem('userSession', session, sessionStorage);
    return session;
};

export const validateSession = (): boolean => {
    const session = StorageManager.getItem<Session>('userSession', sessionStorage);
    if (!session) return false;
    return session.expiresAt > Date.now();
};

export const extendSession = (): void => {
    const session = StorageManager.getItem<Session>('userSession', sessionStorage);
    if (!session) return;
    
    session.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    StorageManager.setItem('userSession', session, sessionStorage);
};

export const clearSession = () => {
    StorageManager.removeItem('userSession', sessionStorage);
};

// Data encryption for storage
export const encryptData = (data: string): string => {
    try {
        if (!data) return '';
        
        const key = 'puzzle_game_key';
        let encrypted = '';
        
        // First stringify the data if it's not already a string
        const stringData = typeof data === 'string' ? data : JSON.stringify(data);
        
        return btoa(unescape(encodeURIComponent(stringData)));
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

export const decryptData = (encrypted: string): string => {
    try {
        if (!encrypted) return '';
        
        return decodeURIComponent(escape(atob(encrypted)));
    } catch (error) {
        console.error('Decryption error:', error);
        return '';
    }
}; 