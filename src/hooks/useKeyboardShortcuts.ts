import { useEffect } from 'react';
import { usePerformance } from '../context/PerformanceContext';

export const useKeyboardShortcuts = () => {
    const { dispatch } = usePerformance();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                dispatch({ type: 'TOGGLE_DEV_CONSOLE' });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch]);
}; 