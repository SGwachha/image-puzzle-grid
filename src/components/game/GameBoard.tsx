import React from 'react';
import PuzzleGrid from './PuzzleGrid';
import GameStats from './GameStats';
import ImagePreview from './ImagePreview';

const GameBoard: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col space-y-6">
                <div className="flex justify-between items-start">
                    <GameStats />
                    <ImagePreview />
                </div>
                <PuzzleGrid />
            </div>
        </div>
    );
};

export default GameBoard; 