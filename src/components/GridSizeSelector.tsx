import React, { useContext } from 'react';
import { GameContext } from '../context/GameContext.tsx';
import { GRID_SIZES } from '../utils/puzzleConfig.ts';

export const GridSizeSelector: React.FC = () => {
    const { gameState, dispatch } = useContext(GameContext);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Grid Size
            </label>
            <select
                value={gameState.gridSize}
                onChange={(e) => dispatch({ 
                    type: 'SET_GRID_SIZE', 
                    payload: parseInt(e.target.value) 
                })}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
                {GRID_SIZES.map(size => (
                    <option key={size} value={size}>
                        {size}x{size}
                    </option>
                ))}
            </select>
        </div>
    );
}; 