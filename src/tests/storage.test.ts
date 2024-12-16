import { 
    checkStorageQuota,
    safeSetItem,
    safeGetItem,
    handleStorageLimit,
    clearGameData 
} from '../utils/storage';

describe('Storage Management', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    test('correctly checks storage quota', () => {
        const quota = checkStorageQuota();
        
        expect(quota.used).toBeDefined();
        expect(quota.available).toBeDefined();
        expect(quota.isNearLimit).toBe(false);
    });

    test('safely stores and retrieves data', () => {
        const testData = { test: 'data' };
        const success = safeSetItem('test', testData);
        const retrieved = safeGetItem('test');
        
        expect(success).toBe(true);
        expect(retrieved).toEqual(testData);
    });

    test('handles storage limits', () => {
        const largeData = new Array(1000000).fill('x').join('');
        safeSetItem('large', largeData);
        
        const warning = handleStorageLimit();
        expect(warning?.type).toBe('warning');
    });
}); 