/*
Security Utilities
*/

// Custom password hashing function
export const hashPassword = (password: string): string => {
    let hash = 0;
    const salt = "puzzle_game_salt";
    const combinedString = password + salt;
    
    for (let i = 0; i < combinedString.length; i++) {
        const char = combinedString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    return hash.toString(16);
};

// Custom encryption
export const encryptData = (data: any): string => {
    try {
        const text = JSON.stringify(data);
        let encrypted = '';
        const key = 'puzzle_game_key';
        
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            encrypted += String.fromCharCode(charCode);
        }
        
        return btoa(unescape(encodeURIComponent(encrypted)));
    } catch (error) {
        console.error('Encryption failed:', error);
        return '';
    }
};

// Custom decryption
export const decryptData = (encryptedData: string): any => {
    try {
        const text = decodeURIComponent(escape(atob(encryptedData)));
        let decrypted = '';
        const key = 'puzzle_game_key';
        
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            decrypted += String.fromCharCode(charCode);
        }
        
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        return [];
    }
};

// Session management
export const SESSION_DURATION = 30 * 60 * 1000;

export const createSession = (userData: User) => {
    try {
        const sessionData = {
            user: userData,
            timestamp: Date.now(),
            expiresAt: Date.now() + SESSION_DURATION
        };
        
        const encryptedSession = encryptData(sessionData);
        sessionStorage.setItem('userSession', encryptedSession);
    } catch (error) {
        console.error('Error creating session:', error);
    }
};

export const validateSession = (): boolean => {
    try {
        const encryptedSession = sessionStorage.getItem('userSession');
        if (!encryptedSession) {
            return false;
        }
        
        const session = decryptData(encryptedSession);
        if (!session || !session.user || Date.now() > session.expiresAt) {
            sessionStorage.removeItem('userSession');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error validating session:', error);
        return false;
    }
};

export const getSessionUser = (): User | null => {
    try {
        const encryptedSession = sessionStorage.getItem('userSession');
        if (!encryptedSession) {
            return null;
        }

        const session = decryptData(encryptedSession);
        if (!session || !session.user || Date.now() > session.expiresAt) {
            sessionStorage.removeItem('userSession');
            return null;
        }

        return session.user;
    } catch (error) {
        console.error('Error getting session user:', error);
        return null;
    }
};

export const refreshSession = () => {
    const encryptedSession = sessionStorage.getItem('userSession');
    if (!encryptedSession) return;
    
    const session = decryptData(encryptedSession);
    if (session) {
        session.expiresAt = Date.now() + SESSION_DURATION;
        sessionStorage.setItem('userSession', encryptData(session));
    }
}; 