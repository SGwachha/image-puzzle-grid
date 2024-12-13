import React from 'react';
import { useGame } from '../context/GameContext.tsx';

const GridSizeSelector: React.FC = () => {
    const { state, dispatch } = useGame();

    const handleGridSizeChange = (size: number) => {
        dispatch({ type: 'SET_GRID_SIZE', size });
        dispatch({ type: 'START_GAME' });
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Grid Size:</label>
            <select
                value={state.currentGrid}
                onChange={(e) => handleGridSizeChange(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                {[2, 3, 4, 6, 8, 10, 12].map((size) => (
                    <option key={size} value={size}>
                        {size}x{size}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default GridSizeSelector; 