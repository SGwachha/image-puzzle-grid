// Simple encryption key
const ENCRYPTION_KEY = 'puzzleGameSecretKey123';

// Storage limits in bytes
const STORAGE_LIMIT = 5 * 1024 * 1024;

// Custom encryption
const encrypt = (data: string): string => {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
    }
    return btoa(result);
};

// Custom decryption
const decrypt = (encryptedData: string): string => {
    const data = atob(encryptedData);
    let result = '';
    for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
        result += String.fromCharCode(charCode);
    }
    return result;
};

// Calculate storage usage
const getStorageUsage = (storage: Storage): number => {
    let total = 0;
    for (let key in storage) {
        if (storage.hasOwnProperty(key)) {
            total += (storage[key].length + key.length) * 2;
        }
    }
    return total;
};

// Check if adding data would exceed storage limit
const wouldExceedLimit = (storage: Storage, key: string, value: string): boolean => {
    const currentUsage = getStorageUsage(storage);
    const newItemSize = (key.length + value.length) * 2;
    return (currentUsage + newItemSize) > STORAGE_LIMIT;
};

export class SecureStorage {
    private storage: Storage;
    private storageType: 'local' | 'session';

    constructor(type: 'local' | 'session') {
        this.storage = type === 'local' ? localStorage : sessionStorage;
        this.storageType = type;
    }

    setItem(key: string, value: any): void {
        const stringValue = JSON.stringify(value);
        const encryptedValue = encrypt(stringValue);

        if (wouldExceedLimit(this.storage, key, encryptedValue)) {
            const error = new Error(`${this.storageType}Storage limit exceeded`);
            error.name = 'StorageQuotaExceeded';
            throw error;
        }

        try {
            this.storage.setItem(key, encryptedValue);
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            throw e;
        }
    }

    getItem<T>(key: string): T | null {
        const encryptedValue = this.storage.getItem(key);
        if (!encryptedValue) return null;

        try {
            const decryptedValue = decrypt(encryptedValue);
            return JSON.parse(decryptedValue);
        } catch (e) {
            console.error('Error decrypting data:', e);
            return null;
        }
    }

    removeItem(key: string): void {
        this.storage.removeItem(key);
    }

    clear(): void {
        this.storage.clear();
    }

    getUsagePercentage(): number {
        return (getStorageUsage(this.storage) / STORAGE_LIMIT) * 100;
    }

    private handleQuotaExceeded(): void {
        // Remove oldest items until we have enough space
        const items = Object.entries(this.storage)
            .map(([key, value]) => ({
                key,
                timestamp: this.getItemTimestamp(key)
            }))
            .sort((a, b) => a.timestamp - b.timestamp);

        for (const item of items) {
            if (getStorageUsage(this.storage) <= STORAGE_LIMIT * 0.9) {
                break;
            }
            this.storage.removeItem(item.key);
        }
    }

    private getItemTimestamp(key: string): number {
        try {
            const value = this.getItem<any>(key);
            return value?.timestamp || 0;
        } catch {
            return 0;
        }
    }
}

// Create instances for local and session storage
export const secureLocalStorage = new SecureStorage('local');
export const secureSessionStorage = new SecureStorage('session'); 