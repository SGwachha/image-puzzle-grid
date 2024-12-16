/*
React Dependencies
*/
import React, { useState } from 'react';

/*
Internal Dependencies
*/
import { useGame } from '../context/GameContext.tsx';

export const ImagePreview: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [showPreview, setShowPreview] = useState(false);

    const handlePreviewClick = () => {
        if (gameState.score > 0 && !showPreview) {
            dispatch({ type: 'USE_PREVIEW' });
            setShowPreview(true);
            setTimeout(() => {
                setShowPreview(false);
            }, 5000);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Image Preview</h3>
                <span className="text-sm text-gray-500">
                    Points: {gameState.score}
                </span>
            </div>
            {showPreview ? (
                <div className="relative aspect-square">
                    <img
                        src={gameState.currentImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded"
                    />
                </div>
            ) : (
                <button
                    onClick={handlePreviewClick}
                    disabled={gameState.score <= 0}
                    className={`w-full py-2 px-4 rounded ${
                        gameState.score > 0
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Show Preview (1 point)
                </button>
            )}
            {showPreview && (
                <div className="mt-2 text-center text-sm text-gray-500">
                    Preview will hide in 5 seconds
                </div>
            )}
        </div>
    );
};
