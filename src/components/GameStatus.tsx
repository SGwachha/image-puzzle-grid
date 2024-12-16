import React, { useContext, useMemo } from 'react';
import { GameContext } from '../context/GameContext';
import { GAME_SETTINGS } from '../utils/puzzleConfig';

export const GameStatus: React.FC = () => {
    const { gameState } = useContext(GameContext);

    const rating = useMemo(() => {
        const timePercentage = (gameState.timeRemaining / GAME_SETTINGS.INITIAL_TIME) * 100;
        
        if (timePercentage > 70 && gameState.incorrectMoves === 0) {
            return 'Excellent';
        } else if (timePercentage > 50 && gameState.incorrectMoves <= 3) {
            return 'Good Job';
        } else if (timePercentage > 0 && gameState.incorrectMoves <= 6) {
            return 'You Can Do Better';
        } else {
            return 'Please Try Again';
        }
    }, [gameState.timeRemaining, gameState.incorrectMoves]);

    return (
        <div className="space-y-2">
            <div className="text-lg">
                Score: {gameState.score}
            </div>
            <div className="text-lg">
                Level: {gameState.level}
            </div>
            <div className="text-lg">
                Incorrect Moves: {gameState.incorrectMoves}
            </div>
            <div className={`text-lg font-bold ${
                rating === 'Excellent' ? 'text-green-600' :
                rating === 'Good Job' ? 'text-blue-600' :
                rating === 'You Can Do Better' ? 'text-yellow-600' :
                'text-red-600'
            }`}>
                Rating: {rating}
            </div>
        </div>
    );
}; 