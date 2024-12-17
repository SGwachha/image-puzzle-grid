# Puzzle Game Technical Documentation

## Architecture Overview

The puzzle game is built using React with TypeScript, implementing a custom state management system using React Context API. The application follows a component-based architecture with clear separation of concerns.

### Core Components

1. **Game Context (`src/context/GameContext.tsx`)**
   - Manages global game state using React Context
   - Handles points system, timer, and game status
   - Implements score calculation and game reset logic

2. **Puzzle Grid (`src/components/PuzzleGrid.tsx`)**
   - Implements custom drag-and-drop logic without external libraries
   - Handles piece validation and placement
   - Manages grid size from 2x2 up to 12x12

3. **Timer (`src/components/Timer.tsx`)**
   - Dynamic timer with level-based time reduction
   - Implements time penalties for incorrect moves
   - Automatic game progression handling

### State Management

The application uses a custom state management system built on React's Context API, avoiding external libraries like Redux. Key features include:

- Centralized game state in GameContext
- Efficient re-render optimization
- Persistent state across page refreshes
- Real-time state updates across components

### Security Features

1. **Storage Security (`src/utils/storage.ts`)**
   - Custom encryption for localStorage and sessionStorage
   - Storage quota management and monitoring
   - Secure data persistence

2. **Authentication System**
   - Custom password hashing implementation
   - Session validation and management
   - Cross-tab session synchronization

### Algorithms

#### Puzzle Shuffling Algorithm
```typescript
function shufflePieces(pieces: PuzzlePiece[]): PuzzlePiece[] {
    const shuffled = [...pieces];
    let inversions = 0;
    
    // Custom shuffle
    do {
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        // ensure puzzle is solvable
        inversions = countInversions(shuffled);
    } while (!isSolvable(inversions, pieces.length));
    
    return shuffled;
}
```

#### Scoring System
The scoring system considers multiple factors:
- Time remaining (30% weight)
- Incorrect moves (40% weight)
- Grid size difficulty (30% weight)

Ratings are calculated based on:
- Excellent: Complete within 30% of time, 0 incorrect moves
- Good Job: Complete within 30-50% of time, ≤3 incorrect moves
- Can Do Better: Complete within 50-99% of time, ≤6 incorrect moves
- Try Again: Time expired or >6 incorrect moves

### Performance Optimization

1. **Memory Management**
   - Efficient image loading and unloading
   - Automatic garbage collection triggers
   - Memory usage monitoring

2. **CPU Optimization**
   - Debounced event handlers
   - Memoized component renders
   - Efficient drag-and-drop calculations

### Cross-Browser Compatibility

The application is tested and optimized for:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Key compatibility features:
- Vendor-prefixed CSS properties
- Polyfills for modern JavaScript features
- Fallback rendering options

## Development Guidelines

1. **Code Style**
   - TypeScript strict mode enabled
   - ESLint configuration for consistency
   - Prettier for code formatting

2. **Testing**
   - Unit tests for utility functions
   - Integration tests for game logic
   - End-to-end tests for user flows

3. **Performance Monitoring**
   - Custom performance tracking
   - FPS monitoring
   - Memory usage tracking

## Future Improvements

1. **Planned Features**
   - Additional puzzle types
   - Multiplayer mode
   - Advanced difficulty levels

2. **Technical Debt**
   - Optimize image loading
   - Improve encryption algorithm
   - Enhanced error handling

## Deployment

The application is designed to be deployed as a static site, with all game logic running client-side. Key deployment considerations:

1. **Environment Setup**
   - Environment variables for API keys
   - Build optimization settings
   - Cache control headers

2. **Performance Monitoring**
   - Real-time performance metrics
   - Error tracking
   - Usage analytics 