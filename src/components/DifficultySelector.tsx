import React from 'react';
import { useGame } from '../context/GameContext.tsx';

export const DifficultySelector: React.FC = () => {
    const { gridSize, setGridSize } = useGame();

    const difficulties = [
        { size: 2, label: 'Easy' },
        { size: 4, label: 'Medium' },
        { size: 6, label: 'Hard' },
        { size: 8, label: 'Expert' },
        { size: 12, label: 'Master' }
    ];

    const handleDifficultyChange = (size: number) => {
        setGridSize(size);
    };

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Select Difficulty
            </h3>
            <div className="flex flex-wrap gap-2">
                {difficulties.map(({ size, label }) => (
                    <button
                        key={size}
                        onClick={() => handleDifficultyChange(size)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            gridSize === size
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {label} ({size}x{size})
                    </button>
                ))}
            </div>
        </div>
    );
}; 