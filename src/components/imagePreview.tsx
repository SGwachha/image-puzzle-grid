import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext.tsx';

interface ImagePreviewProps {
    imageUrl: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const { points, setPoints } = useGame();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        
        if (isVisible) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsVisible(false);
                        return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isVisible]);

    const handlePreviewClick = () => {
        if (points <= 0) {
            alert('Not enough points to use preview!');
            return;
        }

        setPoints(prev => prev - 1);
        setIsVisible(true);
        setTimeLeft(5);
    };

    return (
        <div className="relative">
            <button
                onClick={handlePreviewClick}
                className={`px-4 py-2 rounded-lg ${
                    points > 0 
                        ? 'bg-blue-500 hover:bg-blue-600' 
                        : 'bg-gray-400 cursor-not-allowed'
                } text-white font-semibold transition-colors`}
                disabled={points <= 0}
            >
                Preview Image ({points} points)
            </button>

            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative max-w-2xl p-4">
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                            {timeLeft}s
                        </div>
                        <img 
                            src={imageUrl} 
                            alt="Puzzle Preview" 
                            className="max-w-full max-h-[80vh] rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}; 