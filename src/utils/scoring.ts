export interface ScoreResult {
    score: number;
    rating: 'Excellent' | 'Good Job' | 'You Can Do Better' | 'Please Try Again';
    bonusPoints: number;
}

export const calculateScore = (
    timeRemaining: number,
    maxTime: number,
    incorrectMoves: number,
    level: number
): ScoreResult => {
    const timeUsedPercentage = ((maxTime - timeRemaining) / maxTime) * 100;
    const baseScore = Math.max(0, 1000 - (incorrectMoves * 50));
    let bonusPoints = 0;

    // Calculate rating and bonus points
    if (timeUsedPercentage <= 30 && incorrectMoves === 0) {
        return {
            score: baseScore + 500,
            rating: 'Excellent',
            bonusPoints: 500
        };
    } else if (timeUsedPercentage <= 50 && incorrectMoves <= 3) {
        return {
            score: baseScore + 250,
            rating: 'Good Job',
            bonusPoints: 250
        };
    } else if (timeUsedPercentage <= 99 && incorrectMoves <= 6) {
        return {
            score: baseScore,
            rating: 'You Can Do Better',
            bonusPoints: 0
        };
    } else {
        return {
            score: Math.max(0, baseScore - 200),
            rating: 'Please Try Again',
            bonusPoints: 0
        };
    }
};

export const calculateTimeForLevel = (baseTime: number, level: number, incorrectMoves: number): number => {
    const timeReduction = (level - 1) * 30 + incorrectMoves * 10;
    return Math.max(60, baseTime - timeReduction);
}; 