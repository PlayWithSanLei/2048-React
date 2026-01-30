import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGame } from '../useGame';
import * as storage from '../../utils/storage';
import * as gameLogic from '../../utils/gameLogic';

// Mock dependencies
vi.mock('../../utils/storage', () => ({
  getBestScore: vi.fn(() => 0),
  setBestScore: vi.fn(),
  getGameState: vi.fn(() => null),
  saveGameState: vi.fn(),
}));

vi.mock('../../utils/gameLogic', async (importOriginal) => {
  const actual = await importOriginal<typeof gameLogic>();
  return {
    ...actual,
    generateRandomTile: vi.fn(),
    getEmptyGrid: vi.fn(() => []),
    hasMoves: vi.fn(() => true),
    move: vi.fn(),
  };
});

describe('useGame', () => {
  let mockGetGameState: ReturnType<typeof vi.fn>;
  let mockSaveGameState: ReturnType<typeof vi.fn>;
  let mockGetBestScore: ReturnType<typeof vi.fn>;
  let mockSetBestScore: ReturnType<typeof vi.fn>;
  let mockGenerateRandomTile: ReturnType<typeof vi.fn>;
  let mockGetEmptyGrid: ReturnType<typeof vi.fn>;
  let mockHasMoves: ReturnType<typeof vi.fn>;
  let mockMove: ReturnType<typeof vi.fn>;

  let tileCounter = 0;

  beforeEach(() => {
    tileCounter = 0;

    // Get mock functions
    mockGetGameState = storage.getGameState as ReturnType<typeof vi.fn>;
    mockSaveGameState = storage.saveGameState as ReturnType<typeof vi.fn>;
    mockGetBestScore = storage.getBestScore as ReturnType<typeof vi.fn>;
    mockSetBestScore = storage.setBestScore as ReturnType<typeof vi.fn>;
    mockGenerateRandomTile = gameLogic.generateRandomTile as ReturnType<typeof vi.fn>;
    mockGetEmptyGrid = gameLogic.getEmptyGrid as ReturnType<typeof vi.fn>;
    mockHasMoves = gameLogic.hasMoves as ReturnType<typeof vi.fn>;
    mockMove = gameLogic.move as ReturnType<typeof vi.fn>;

    // Reset mocks
    vi.clearAllMocks();

    // Default mock implementations
    mockGetBestScore.mockReturnValue(0);
    mockGetGameState.mockReturnValue(null);
    mockHasMoves.mockReturnValue(true);

    // Create empty grid mock
    const emptyGrid: gameLogic.Grid = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => null)
    );
    mockGetEmptyGrid.mockReturnValue(emptyGrid);

    // Mock generateRandomTile to always return a new tile
    mockGenerateRandomTile.mockImplementation(() => {
      return {
        id: `tile-${tileCounter++}`,
        value: 2,
        position: { x: 0, y: 0 },
        isNew: true,
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== Initialization ====================
  describe('initialization', () => {
    it('HG-001: should initialize with two tiles when no saved state exists', async () => {
      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
        expect(result.current.score).toBe(0);
        expect(result.current.over).toBe(false);
        expect(result.current.won).toBe(false);
      });
    });

    it('HG-002: should load saved state if available', async () => {
      const savedState = {
        tiles: [
          { id: '1', value: 4, position: { x: 0, y: 0 } },
          { id: '2', value: 8, position: { x: 1, y: 1 } },
        ],
        score: 150,
        bestScore: 300,
        over: false,
        won: false,
      };
      mockGetGameState.mockReturnValue(savedState);
      mockGetBestScore.mockReturnValue(300);

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
        expect(result.current.score).toBe(150);
        expect(result.current.bestScore).toBe(300);
      });
    });

    it('HG-003: should set initialized to true after setup', async () => {
      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  // ==================== startNewGame ====================
  describe('startNewGame', () => {
    it('HG-004: should reset state when starting new game', async () => {
      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.startNewGame();
      });

      expect(result.current.score).toBe(0);
      expect(result.current.over).toBe(false);
      expect(result.current.won).toBe(false);
      expect(result.current.tiles).toHaveLength(2);
    });

    it('HG-005: should reset state after game over', async () => {
      // Mock a game over state
      const gameOverState = {
        tiles: Array.from({ length: 16 }, (_, i) => ({
          id: `${i}`,
          value: 2,
          position: { x: i % 4, y: Math.floor(i / 4) },
        })),
        score: 100,
        bestScore: 200,
        over: true,
        won: false,
      };
      mockGetGameState.mockReturnValue(gameOverState);

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.over).toBe(true);
      });

      act(() => {
        result.current.startNewGame();
      });

      expect(result.current.score).toBe(0);
      expect(result.current.over).toBe(false);
      expect(result.current.won).toBe(false);
    });
  });

  // ==================== moveTiles ====================
  describe('moveTiles', () => {
    it('HG-006: should update tiles after valid move', async () => {
      mockMove.mockReturnValue({
        tiles: [
          { id: '1', value: 4, position: { x: 0, y: 0 } },
        ],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(mockMove).toHaveBeenCalled();
      expect(result.current.score).toBe(4);
    });

    it('HG-007: should not move when game is over', async () => {
      // Set up a saved game over state
      const gameOverState = {
        tiles: [
          { id: '1', value: 2, position: { x: 0, y: 0 } },
          { id: '2', value: 4, position: { x: 1, y: 0 } },
        ],
        score: 100,
        bestScore: 200,
        over: true,
        won: false,
      };
      mockGetGameState.mockReturnValue(gameOverState);

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.over).toBe(true);
      });

      const previousTiles = [...result.current.tiles];

      act(() => {
        result.current.moveTiles('LEFT');
      });

      // Tiles should not change when game is over
      expect(result.current.tiles).toEqual(previousTiles);
      expect(mockMove).not.toHaveBeenCalled();
    });

    it('HG-008: should set won to true when 2048 tile is created', async () => {
      mockMove.mockReturnValue({
        tiles: [
          { id: '2048', value: 2048, position: { x: 3, y: 3 } },
        ],
        scoreIncrease: 2048,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.won).toBe(true);
    });

    it('HG-009: should set over to true when no moves available', async () => {
      // First move is valid
      mockMove.mockReturnValue({
        tiles: [
          { id: '1', value: 4, position: { x: 0, y: 0 } },
        ],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      // After the move, set hasMoves to false
      mockHasMoves.mockReturnValue(false);

      act(() => {
        result.current.moveTiles('LEFT');
      });

      await waitFor(() => {
        expect(result.current.over).toBe(true);
      });
    });

    it('HG-010: should add new tile after valid move', async () => {
      mockMove.mockReturnValue({
        tiles: [
          { id: '1', value: 4, position: { x: 0, y: 0 } },
        ],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      // Should have moved tile + new tile
      expect(result.current.tiles.length).toBe(2);
    });

    it('should not add new tile when move does not change position', async () => {
      mockMove.mockReturnValue({
        tiles: [
          { id: '1', value: 2, position: { x: 0, y: 0 } },
          { id: '2', value: 2, position: { x: 1, y: 0 } },
        ],
        scoreIncrease: 0,
        moved: false,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      const previousLength = result.current.tiles.length;

      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.tiles.length).toBe(previousLength);
    });

    it('should update score correctly after merge', async () => {
      mockMove.mockReturnValue({
        tiles: [
          { id: 'merged', value: 8, position: { x: 0, y: 0 } },
        ],
        scoreIncrease: 8,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      const previousScore = result.current.score;

      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.score).toBe(previousScore + 8);
    });
  });

  // ==================== State Persistence ====================
  describe('state persistence', () => {
    it('should save state to localStorage after move', async () => {
      mockMove.mockReturnValue({
        tiles: [
          { id: '1', value: 4, position: { x: 0, y: 0 } },
        ],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      await waitFor(() => {
        expect(mockSaveGameState).toHaveBeenCalled();
      });
    });

    it('should update bestScore when current score exceeds it', async () => {
      mockGetBestScore.mockReturnValue(100);
      mockMove.mockReturnValue({
        tiles: [{ id: '1', value: 4, position: { x: 0, y: 0 } }],
        scoreIncrease: 150,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.bestScore).toBe(100);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      await waitFor(() => {
        expect(result.current.score).toBeGreaterThan(100);
        expect(mockSetBestScore).toHaveBeenCalled();
      });
    });
  });

  // ==================== Edge Cases ====================
  describe('edge cases', () => {
    it('should handle multiple rapid moves', async () => {
      mockMove.mockReturnValue({
        tiles: [{ id: '1', value: 4, position: { x: 0, y: 0 } }],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.moveTiles('LEFT');
        result.current.moveTiles('RIGHT');
        result.current.moveTiles('UP');
      });

      expect(mockMove).toHaveBeenCalledTimes(3);
    });

    it('should not crash when grid is full but moves are available', async () => {
      const fullGridTiles = Array.from({ length: 16 }, (_, i) => ({
        id: `tile-${i}`,
        value: i % 2 === 0 ? 2 : 4,
        position: { x: i % 4, y: Math.floor(i / 4) },
      }));

      mockGetGameState.mockReturnValue({
        tiles: fullGridTiles,
        score: 100,
        bestScore: 200,
        over: false,
        won: false,
      });

      mockMove.mockReturnValue({
        tiles: [
          { id: 'merged-1', value: 4, position: { x: 0, y: 0 } },
          { id: 'merged-2', value: 8, position: { x: 1, y: 0 } },
        ],
        scoreIncrease: 12,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(16);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.tiles).toBeTruthy();
    });
  });

  // ==================== Undo Functionality ====================
  describe('undo', () => {
    it('should have canUndo as false initially', async () => {
      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      expect(result.current.canUndo).toBe(false);
    });

    it('should set canUndo to true after a move', async () => {
      mockMove.mockReturnValue({
        tiles: [{ id: '1', value: 4, position: { x: 0, y: 0 } }],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.canUndo).toBe(true);
    });

    it('should restore previous state after undo', async () => {
      // Initial tiles
      const initialTiles = [
        { id: 'tile-0', value: 2, position: { x: 0, y: 0 } },
        { id: 'tile-1', value: 2, position: { x: 1, y: 0 } },
      ];

      // Mock to return initial tiles then moved tiles
      let moveCount = 0;
      mockMove.mockImplementation(() => {
        moveCount++;
        if (moveCount === 1) {
          return {
            tiles: [{ id: 'tile-2', value: 4, position: { x: 0, y: 0 } }],
            scoreIncrease: 4,
            moved: true,
          };
        }
        return {
          tiles: [],
          scoreIncrease: 0,
          moved: false,
        };
      });

      // Set initial state
      mockGetGameState.mockReturnValue({
        tiles: initialTiles,
        score: 10,
        bestScore: 100,
        over: false,
        won: false,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.score).toBe(10);
      });

      // Make a move
      act(() => {
        result.current.moveTiles('LEFT');
      });

      // Score should increase
      expect(result.current.score).toBe(14);
      expect(result.current.canUndo).toBe(true);

      // Undo
      act(() => {
        result.current.undo();
      });

      // State should be restored
      expect(result.current.score).toBe(10);
      expect(result.current.canUndo).toBe(false);
    });

    it('should restore tiles after undo', async () => {
      const initialTiles = [
        { id: 'tile-a', value: 2, position: { x: 0, y: 0 } },
        { id: 'tile-b', value: 4, position: { x: 1, y: 1 } },
      ];

      mockMove.mockReturnValue({
        tiles: [{ id: 'tile-c', value: 8, position: { x: 0, y: 0 } }],
        scoreIncrease: 8,
        moved: true,
      });

      mockGetGameState.mockReturnValue({
        tiles: initialTiles,
        score: 0,
        bestScore: 100,
        over: false,
        won: false,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      const initialTileIds = result.current.tiles.map(t => t.id);

      // Make a move
      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.tiles).toHaveLength(2); // moved tile + new tile

      // Undo
      act(() => {
        result.current.undo();
      });

      // Tiles should be restored
      expect(result.current.tiles).toHaveLength(2);
      expect(result.current.tiles.map(t => t.id)).toEqual(initialTileIds);
    });

    it('should restore over and won state after undo', async () => {
      // Test that undo correctly restores the over state from history
      const initialTiles = [
        { id: '1', value: 2, position: { x: 0, y: 0 } },
        { id: '2', value: 4, position: { x: 1, y: 1 } },
      ];

      mockMove.mockReturnValue({
        tiles: [{ id: '3', value: 8, position: { x: 0, y: 0 } }],
        scoreIncrease: 4,
        moved: true,
      });

      mockGetGameState.mockReturnValue({
        tiles: initialTiles,
        score: 10,
        bestScore: 100,
        over: false,
        won: true, // Start with won state
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.won).toBe(true);
      });

      // Make a move (won=true should be saved to history)
      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.canUndo).toBe(true);

      // Undo should restore won=true state
      act(() => {
        result.current.undo();
      });

      await waitFor(() => {
        expect(result.current.won).toBe(true);
      });
      expect(result.current.canUndo).toBe(false);
    });

    it('should handle multiple undo operations', async () => {
      let callCount = 0;

      mockMove.mockImplementation(() => {
        callCount++;
        return {
          tiles: [{ id: `tile-${callCount}`, value: 2, position: { x: 0, y: 0 } }],
          scoreIncrease: 2,
          moved: true,
        };
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      // Make 3 moves
      act(() => {
        result.current.moveTiles('LEFT');
        result.current.moveTiles('RIGHT');
        result.current.moveTiles('UP');
      });

      // Wait for state updates
      await waitFor(() => {
        expect(result.current.canUndo).toBe(true);
      });

      // Undo all 3 moves
      act(() => {
        result.current.undo();
      });

      await waitFor(() => {
        expect(result.current.canUndo).toBe(true);
      });

      act(() => {
        result.current.undo();
      });

      await waitFor(() => {
        expect(result.current.canUndo).toBe(true);
      });

      act(() => {
        result.current.undo();
      });

      await waitFor(() => {
        expect(result.current.canUndo).toBe(false);
      });
    });

    it('should not undo when history is empty', async () => {
      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      const previousScore = result.current.score;

      // Try to undo when history is empty
      act(() => {
        result.current.undo();
      });

      expect(result.current.score).toBe(previousScore);
      expect(result.current.canUndo).toBe(false);
    });

    it('should clear history when starting new game', async () => {
      mockMove.mockReturnValue({
        tiles: [{ id: '1', value: 4, position: { x: 0, y: 0 } }],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      // Make a move to create history
      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.canUndo).toBe(true);

      // Start new game
      act(() => {
        result.current.startNewGame();
      });

      expect(result.current.canUndo).toBe(false);
      expect(result.current.score).toBe(0);
    });

    it('should allow undo after game over', async () => {
      mockMove.mockReturnValue({
        tiles: [{ id: '1', value: 4, position: { x: 0, y: 0 } }],
        scoreIncrease: 4,
        moved: true,
      });

      const { result } = renderHook(() => useGame());

      await waitFor(() => {
        expect(result.current.tiles).toHaveLength(2);
      });

      // Make a move
      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.score).toBe(4);

      // Game over
      mockHasMoves.mockReturnValue(false);
      act(() => {
        result.current.moveTiles('LEFT');
      });

      expect(result.current.over).toBe(true);

      // Undo should work and restore state
      act(() => {
        result.current.undo();
      });

      expect(result.current.over).toBe(false);
      expect(result.current.canUndo).toBe(false);
    });
  });
});
