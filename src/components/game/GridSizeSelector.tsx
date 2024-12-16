import React from 'react';
import { useGame } from '../../context/GameContext';

const GridSizeSelector: React.FC = () => {
    const { state, dispatch } = useGame();

    const handleGridSizeChange = (size: number) => {
        dispatch({ type: 'SET_GRID_SIZE', size });
        dispatch({ type: 'START_GAME' });
    };

    const gridSizes = [2, 3, 4, 6, 8, 10, 12];

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Grid Size:
            </label>
            <div className="flex flex-wrap gap-2">
                {gridSizes.map(size => (
                    <button
                        key={size}
                        onClick={() => handleGridSizeChange(size)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-medium
                            transition-colors duration-200
                            ${state.currentGrid === size
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                        `}
                    >
                        {size}x{size}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GridSizeSelector; 