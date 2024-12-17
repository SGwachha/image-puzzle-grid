// Custom hash function
export const hashPassword = (password: string): string => {
    let hash = 0;
    const salt = "puzzleGame";
    const input = password + salt;
    
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16);
};

// Session management
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const createSession = (userId: string): string => {
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const session = {
        userId,
        token: sessionToken,
        expiresAt: Date.now() + SESSION_DURATION
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('puzzleGameSession', JSON.stringify(session));
    return sessionToken;
};

export const validateSession = (): boolean => {
    const sessionData = sessionStorage.getItem('puzzleGameSession');
    if (!sessionData) return false;
    
    try {
        const session = JSON.parse(sessionData);
        if (Date.now() > session.expiresAt) {
            sessionStorage.removeItem('puzzleGameSession');
            return false;
        }
        return true;
    } catch {
        return false;
    }
};

export const clearSession = () => {
    sessionStorage.removeItem('puzzleGameSession');
}; 