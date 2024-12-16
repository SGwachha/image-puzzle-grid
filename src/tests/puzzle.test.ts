import { 
    generatePuzzlePieces, 
    shufflePieces, 
    validatePiecePosition,
    calculatePieceDimensions,
    isPuzzleSolvable 
} from '../utils/puzzle';

describe('Puzzle Generation', () => {
    test('generates correct number of pieces for given grid size', () => {
        const gridSize = 3;
        const imageUrl = 'test.jpg';
        const pieces = generatePuzzlePieces(gridSize, imageUrl);
        
        expect(pieces.length).toBe(gridSize * gridSize);
        expect(pieces[0].gridSize).toBe(gridSize);
    });

    test('generates pieces with correct background positions', () => {
        const gridSize = 2;
        const pieces = generatePuzzlePieces(gridSize, 'test.jpg');
        
        expect(pieces[0].backgroundPosition).toEqual({ x: 0, y: 0 });
        expect(pieces[3].backgroundPosition).toEqual({ x: 100, y: 100 });
    });
});

describe('Puzzle Shuffling', () => {
    test('maintains all pieces after shuffle', () => {
        const pieces = generatePuzzlePieces(3, 'test.jpg');
        const shuffled = shufflePieces(pieces);
        
        expect(shuffled.length).toBe(pieces.length);
        expect(new Set(shuffled.map(p => p.id)).size).toBe(pieces.length);
    });

    test('ensures puzzle is solvable', () => {
        const pieces = generatePuzzlePieces(4, 'test.jpg');
        const shuffled = shufflePieces(pieces);
        
        expect(isPuzzleSolvable(shuffled)).toBe(true);
    });
});

describe('Piece Validation', () => {
    test('correctly validates piece position', () => {
        const piece = {
            id: 0,
            correctPosition: 0,
            currentPosition: 0,
            imageUrl: 'test.jpg'
        };
        
        expect(validatePiecePosition(piece, 0)).toBe(true);
        expect(validatePiecePosition(piece, 1)).toBe(false);
    });
});

describe('Dimension Calculations', () => {
    test('calculates correct piece dimensions', () => {
        const gridSize = 4;
        const containerWidth = 400;
        const dimensions = calculatePieceDimensions(gridSize, containerWidth);
        
        expect(dimensions.width).toBe(100);
        expect(dimensions.height).toBe(100);
    });
}); 