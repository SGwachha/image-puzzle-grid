import { LeaderboardState } from '../types';

interface BroadcastMessage {
    type: 'SCORE_UPDATE' | 'GAME_STATE_UPDATE';
    payload: any;
    timestamp: number;
    userId: string;
}

export class GameChannel {
    private channel: BroadcastChannel;
    private listeners: Map<string, (message: BroadcastMessage) => void>;

    constructor() {
        this.channel = new BroadcastChannel('puzzle_game');
        this.listeners = new Map();
        
        this.channel.onmessage = (event) => {
            this.listeners.forEach(listener => listener(event.data));
        };
    }

    subscribe(id: string, callback: (message: BroadcastMessage) => void) {
        this.listeners.set(id, callback);
    }

    unsubscribe(id: string) {
        this.listeners.delete(id);
    }

    broadcast(message: Omit<BroadcastMessage, 'timestamp'>) {
        this.channel.postMessage({
            ...message,
            timestamp: Date.now()
        });
    }

    close() {
        this.channel.close();
        this.listeners.clear();
    }
}

export const gameChannel = new GameChannel(); 