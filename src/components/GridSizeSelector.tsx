import React from 'react';
import { useGame } from '../context/GameContext.tsx';

export const GridSizeSelector: React.FC = () => {
    const { gridSize, setGridSize } = useGame();
    const minSize = 2;
    const maxSize = 12;

    const gridSizes = Array.from(
        { length: (maxSize - minSize) / 2 + 1 },
        (_, i) => minSize + i * 2
    );

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Grid Size
            </label>
            <select
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {gridSizes.map(size => (
                    <option key={size} value={size}>
                        {size}x{size}
                    </option>
                ))}
            </select>
        </div>
    );
}; 