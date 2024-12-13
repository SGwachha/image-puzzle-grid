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