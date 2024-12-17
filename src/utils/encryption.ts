export class CustomEncryption {
    private static readonly SALT = 'PuzzleGameSalt';
    private static readonly ITERATIONS = 1000;
    private static readonly STATIC_KEY = 'PuzzleGameStaticKey2023';

    // Simple custom hash function for passwords
    static hashPassword(password: string): string {
        let hash = 0;
        const combinedStr = password + this.SALT;
        
        for (let i = 0; i < this.ITERATIONS; i++) {
            for (let j = 0; j < combinedStr.length; j++) {
                hash = ((hash << 5) - hash) + combinedStr.charCodeAt(j);
                hash = hash & hash;
            }
        }

        return hash.toString(36);
    }

    // Custom encryption for storing data
    static encrypt(data: any): string {
        try {
            const jsonStr = JSON.stringify(data);
            let encrypted = '';
            const key = this.STATIC_KEY;

            for (let i = 0; i < jsonStr.length; i++) {
                const charCode = jsonStr.charCodeAt(i);
                const keyChar = key.charCodeAt(i % key.length);
                encrypted += String.fromCharCode(charCode ^ keyChar);
            }

            return btoa(encrypted);
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt data');
        }
    }

    // Custom decryption for retrieving data
    static decrypt(encryptedData: string): any {
        try {
            const encrypted = atob(encryptedData);
            let decrypted = '';
            const key = this.STATIC_KEY;

            for (let i = 0; i < encrypted.length; i++) {
                const charCode = encrypted.charCodeAt(i);
                const keyChar = key.charCodeAt(i % key.length);
                decrypted += String.fromCharCode(charCode ^ keyChar);
            }

            try {
                const parsed = JSON.parse(decrypted);
                if (typeof parsed !== 'object' || parsed === null) {
                    throw new Error('Decrypted data is not a valid object');
                }
                return parsed;
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return null;
            }
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    // Generate a key based on static value and salt
    private static generateKey(): string {
        return this.hashPassword(this.STATIC_KEY + this.SALT);
    }
}

export class SecureStorage {
    private static readonly MAX_STORAGE_SIZE = 5 * 1024 * 1024;

    static setItem(storage: Storage, key: string, value: any): boolean {
        try {
            // Check current storage usage
            const currentSize = this.getStorageSize(storage);
            const valueSize = new Blob([JSON.stringify(value)]).size;

            if (currentSize + valueSize > this.MAX_STORAGE_SIZE) {
                throw new Error('Storage quota exceeded');
            }

            // Encrypt and store
            const encrypted = CustomEncryption.encrypt(value);
            storage.setItem(key, encrypted);
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    static getItem(storage: Storage, key: string): any {
        try {
            const encrypted = storage.getItem(key);
            if (!encrypted) return null;
            return CustomEncryption.decrypt(encrypted);
        } catch (error) {
            console.error('Retrieval error:', error);
            return null;
        }
    }

    static removeItem(storage: Storage, key: string): void {
        try {
            storage.removeItem(key);
        } catch (error) {
            console.error('Remove error:', error);
        }
    }

    static clear(storage: Storage): void {
        try {
            storage.clear();
        } catch (error) {
            console.error('Clear error:', error);
        }
    }

    private static getStorageSize(storage: Storage): number {
        try {
            let size = 0;
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key) {
                    size += new Blob([key]).size;
                    const value = storage.getItem(key);
                    if (value) {
                        size += new Blob([value]).size;
                    }
                }
            }
            return size;
        } catch (error) {
            console.error('Storage size calculation error:', error);
            return 0;
        }
    }

    static getStorageUsage(storage: Storage): { used: number, total: number } {
        return {
            used: this.getStorageSize(storage),
            total: this.MAX_STORAGE_SIZE
        };
    }
} 