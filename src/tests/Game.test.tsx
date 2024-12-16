import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Game } from '../components/Game';
import { GameProvider } from '../context/GameContext';

describe('Game Component', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        localStorage.clear();
        sessionStorage.clear();
    });

    test('initializes with correct default state', () => {
        const { getByText } = render(
            <GameProvider>
                <Game />
            </GameProvider>
        );

        expect(getByText('Time: 5:00')).toBeInTheDocument();
        expect(getByText('Level: 1')).toBeInTheDocument();
        expect(getByText('Score: 3')).toBeInTheDocument();
    });

    test('timer decrements correctly', () => {
        const { getByText } = render(
            <GameProvider>
                <Game />
            </GameProvider>
        );

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(getByText('Time: 4:59')).toBeInTheDocument();
    });

    test('grid size selector changes puzzle size', () => {
        const { getByLabelText } = render(
            <GameProvider>
                <Game />
            </GameProvider>
        );

        const selector = getByLabelText('Grid Size');
        fireEvent.change(selector, { target: { value: '4' } });

        expect(selector).toHaveValue('4');
    });
}); 