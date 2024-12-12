export interface PuzzleImage {
    id: number;
    url: string;
    name: string;
}

export const puzzleImages: PuzzleImage[] = [
    {
        id: 1,
        url: '/images/SunsetTree.jpg',
        name: 'Sunset Tree'
    },
    {
        id: 2,
        url: '/images/forest.webp',
        name: 'Forest Trail'
    },
    {
        id: 3,
        url: '/images/waterfall.webp',
        name: 'Waterfall'
    },
    {
        id: 4,
        url: '/images/cat.jpg',
        name: 'Cat'
    },
    {
        id: 5,
        url: '/images/sky.webp',
        name: 'Sky'
    }
];

export const getRandomPuzzleImage = (): PuzzleImage => {
    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    return puzzleImages[randomIndex];
};