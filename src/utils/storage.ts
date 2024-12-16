import { STORAGE_LIMITS } from './puzzleConfig.ts';
import { encryptData, decryptData } from './security.ts';

export class StorageManager {
    private static calculateStorageUsage(storage: Storage): number {
        let total = 0;
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key) {
                total += (key.length + (storage.getItem(key)?.length || 0)) * 2;
            }
        }
        return total;
    }

    private static async checkStorageLimit(storage: Storage, newDataSize: number): Promise<boolean> {
        const currentUsage = this.calculateStorageUsage(storage);
        return (currentUsage + newDataSize) <= (storage === localStorage ? 
            STORAGE_LIMITS.LOCAL_STORAGE : STORAGE_LIMITS.SESSION_STORAGE);
    }

    static async setItem(key: string, value: any, storage: Storage = localStorage): Promise<boolean> {
        try {
            if (value === null || value === undefined) {
                storage.removeItem(key);
                return true;
            }

            const serializedValue = JSON.stringify(value);
            const encryptedValue = encryptData(serializedValue);
            
            if (!encryptedValue) {
                console.error('Failed to encrypt data');
                return false;
            }
            
            if (await this.checkStorageLimit(storage, encryptedValue.length * 2)) {
                storage.setItem(key, encryptedValue);
                return true;
            } else {
                throw new Error('Storage limit reached');
            }
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    static getItem<T>(key: string, storage: Storage = localStorage): T | null {
        try {
            const encryptedValue = storage.getItem(key);
            if (!encryptedValue) return null;
            
            const decryptedValue = decryptData(encryptedValue);
            if (!decryptedValue) {
                console.error('Failed to decrypt data');
                storage.removeItem(key);
                return null;
            }
            
            try {
                return JSON.parse(decryptedValue) as T;
            } catch (parseError) {
                console.error('Failed to parse data:', parseError);
                storage.removeItem(key);
                return null;
            }
        } catch (error) {
            console.error('Storage error:', error);
            return null;
        }
    }

    static removeItem(key: string, storage: Storage = localStorage): void {
        storage.removeItem(key);
    }

    static clearStorage(storage: Storage = localStorage): void {
        storage.clear();
    }

    static getStorageUsagePercentage(storage: Storage = localStorage): number {
        const currentUsage = this.calculateStorageUsage(storage);
        const limit = storage === localStorage ? 
            STORAGE_LIMITS.LOCAL_STORAGE : 
            STORAGE_LIMITS.SESSION_STORAGE;
        return (currentUsage / limit) * 100;
    }

    static async handleStorageLimit(storage: Storage = localStorage): Promise<boolean> {
        const usage = this.calculateStorageUsage(storage);
        const limit = storage === localStorage ? 
            STORAGE_LIMITS.LOCAL_STORAGE : 
            STORAGE_LIMITS.SESSION_STORAGE;
        
        if (usage >= limit * 0.8) {
            return false;
        }
        return true;
    }

    static clearGameData(): void {
        const keysToKeep = ['userSession'];
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !keysToKeep.includes(key)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
} 