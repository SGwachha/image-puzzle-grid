import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const PREVIEW_DURATION = 5000;

const ImagePreview: React.FC = () => {
    const { state, dispatch } = useGame();

    const handlePreviewClick = () => {
        if (state.points > 0 && !state.isPreviewActive) {
            dispatch({ type: 'USE_PREVIEW' });
        }
    };

    useEffect(() => {
        if (state.isPreviewActive) {
            const timeoutId = setTimeout(() => {
                dispatch({ type: 'END_PREVIEW' });
            }, PREVIEW_DURATION);

            return () => clearTimeout(timeoutId);
        }
    }, [state.isPreviewActive, dispatch]);

    return (
        <div className="relative">
            <button
                onClick={handlePreviewClick}
                disabled={state.points <= 0 || state.isPreviewActive}
                className={`
                    px-4 py-2 rounded-lg font-medium
                    transition-colors duration-200
                    ${state.points <= 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'}
                `}
            >
                Preview Image ({state.points} points left)
            </button>

            {state.isPreviewActive && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="relative max-w-2xl p-4">
                        <img
                            src={state.currentImage}
                            alt="Puzzle Preview"
                            className="rounded-lg shadow-xl"
                        />
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full">
                            {Math.ceil(PREVIEW_DURATION / 1000)}s
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagePreview; 