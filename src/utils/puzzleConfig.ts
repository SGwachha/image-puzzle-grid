export interface PuzzleImage {
    id: number;
    url: string;
    name: string;
}

export const PUZZLE_IMAGES: PuzzleImage[] = [
    { id: 1, url: '/images/cat.jpg', name: 'Cat' },
    { id: 2, url: '/images/forest.webp', name: 'Forest' },
    { id: 3, url: '/images/sky.webp', name: 'Sky' },
    { id: 4, url: '/images/sunsetTree.jpg', name: 'Sunset Tree' },
    { id: 5, url: '/images/waterfall.webp', name: 'Waterfall' },
];

export const GRID_SIZES = [2, 3, 4, 6, 8, 10, 12];

export const STORAGE_LIMITS = {
    LOCAL_STORAGE: 5 * 1024 * 1024,
    SESSION_STORAGE: 5 * 1024 * 1024,
};

export const GAME_SETTINGS = {
    INITIAL_TIME: 300,
    TIME_REDUCTION_PER_LEVEL: 30,
    TIME_PENALTY_PER_MISTAKE: 10,
    MAX_INCORRECT_MOVES: 6,
    INITIAL_POINTS: 3,
    PREVIEW_DURATION: 5000,
    MAX_CONSECUTIVE_FAILURES: 3
}; 