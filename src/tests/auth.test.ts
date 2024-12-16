import { 
    hashPassword,
    createSession,
    validateSession,
    extendSession 
} from '../utils/security';
import '@types/jest';

describe('Authentication', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test('generates consistent hash for same password', () => {
        const password = 'testPassword123';
        const hash1 = hashPassword(password);
        const hash2 = hashPassword(password);
        
        expect(hash1).toBe(hash2);
    });

    test('creates valid session', () => {
        const user = { id: '123', username: 'test' };
        const session = createSession(user);
        
        expect(session.userId).toBe(user.id);
        expect(session.expiresAt).toBeGreaterThan(Date.now());
    });

    test('validates session correctly', () => {
        const user = { id: '123', username: 'test' };
        createSession(user);
        
        expect(validateSession()).toBe(true);
    });

    test('extends session expiry', () => {
        const user = { id: '123', username: 'test' };
        const session = createSession(user);
        const originalExpiry = session.expiresAt;
        
        setTimeout(() => {
            extendSession();
            const newSession = JSON.parse(sessionStorage.getItem('userSession') || '{}');
            expect(newSession.expiresAt).toBeGreaterThan(originalExpiry);
        }, 100);
    });
}); 