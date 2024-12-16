export interface PuzzleImage {
    id: number;
    name: string;
    url: string;
}

const puzzleImages: PuzzleImage[] = [
    {
        id: 1,
        name: 'Cat',
        url: '/images/cat.jpg',
    },
    {
        id: 2,
        name: 'Forest',
        url: '/images/forest.webp',
    },
    {
        id: 3,
        name: 'Sky',
        url: '/images/sky.webp',
    },
    {
        id: 4,
        name: 'Sunset',
        url: '/images/sunsetTree.jpg',
    },
    {
        id: 5,
        name: 'waterfall',
        url: '/images/waterfall.webp',
    },
];

export const getRandomPuzzleImage = (): PuzzleImage => {
    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    return puzzleImages[randomIndex];
};

export const preloadImages = () => {
    puzzleImages.forEach(image => {
        const img = new Image();
        img.src = image.url;
    });
};

export default puzzleImages;