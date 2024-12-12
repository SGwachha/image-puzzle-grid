/*
React Dependencies
*/
import React, { useState } from 'react';

/*
Internal Dependencies
*/
import { useGame } from '../context/GameContext.tsx';

const ImagePreview: React.FC = () => {
    const { state, dispatch } = useGame();
    const [showPreview, setShowPreview] = useState(false);

    const handlePreviewClick = () => {
        if (state.points > 0) {
            dispatch({ type: 'USE_PREVIEW' });
            setShowPreview(true);
            setTimeout(() => {
                setShowPreview(false);
            }, 5000);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">Image Preview</h3>
            <button
                onClick={handlePreviewClick}
                disabled={state.points === 0}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                Show Preview ({state.points} points left)
            </button>
            {showPreview && (
                <div className="mt-4">
                    <img
                        src={state.currentImage}
                        alt="Puzzle Preview"
                        className="w-full rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default ImagePreview;
