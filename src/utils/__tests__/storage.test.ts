import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getBestScore,
  setBestScore,
  getTheme,
  setTheme,
  saveGameState,
  getGameState,
} from '../storage';
import type { GameState } from '../gameLogic';

describe('storage', () => {
  // Mock localStorage
  let localStorageMock: {
    getItem: ReturnType<typeof vi.fn>;
    setItem: ReturnType<typeof vi.fn>;
    removeItem: ReturnType<typeof vi.fn>;
    clear: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== getBestScore / setBestScore ====================
  describe('getBestScore / setBestScore', () => {
    it('ST-001: should return 0 when no score is saved', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(getBestScore()).toBe(0);
    });

    it('ST-002: should save and retrieve score correctly', () => {
      localStorageMock.getItem.mockReturnValue(null);
      setBestScore(100);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('2048_best_score', '100');

      // Simulate retrieval
      localStorageMock.getItem.mockReturnValue('100');
      expect(getBestScore()).toBe(100);
    });

    it('ST-003: should update existing score', () => {
      localStorageMock.getItem.mockReturnValue('100');
      expect(getBestScore()).toBe(100);

      setBestScore(200);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('2048_best_score', '200');

      localStorageMock.getItem.mockReturnValue('200');
      expect(getBestScore()).toBe(200);
    });

    it('ST-004: should return 0 after localStorage is cleared', () => {
      localStorageMock.getItem.mockReturnValue('100');
      expect(getBestScore()).toBe(100);

      localStorageMock.getItem.mockReturnValue(null);
      expect(getBestScore()).toBe(0);
    });
  });

  // ==================== getTheme / setTheme ====================
  describe('getTheme / setTheme', () => {
    it('ST-005: should return default theme "candy" when not set', () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(getTheme()).toBe('candy');
    });

    it('ST-006: should save and retrieve theme correctly', () => {
      localStorageMock.getItem.mockReturnValue(null);
      setTheme('mint');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('2048_theme', 'mint');

      localStorageMock.getItem.mockReturnValue('mint');
      expect(getTheme()).toBe('mint');
    });

    it('ST-007: should switch themes correctly', () => {
      localStorageMock.getItem.mockReturnValue('candy');
      expect(getTheme()).toBe('candy');

      setTheme('mint');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('2048_theme', 'mint');

      localStorageMock.getItem.mockReturnValue('mint');
      expect(getTheme()).toBe('mint');
    });
  });

  // ==================== saveGameState / getGameState ====================
  describe('saveGameState / getGameState', () => {
    const mockGameState: GameState = {
      tiles: [
        {
          id: 'tile-1',
          value: 2,
          position: { x: 0, y: 0 },
          isNew: true,
        },
        {
          id: 'tile-2',
          value: 4,
          position: { x: 1, y: 1 },
          mergedFrom: [
            { id: 'tile-3', value: 2, position: { x: 0, y: 1 } },
            { id: 'tile-4', value: 2, position: { x: 1, y: 1 } },
          ],
        },
      ],
      score: 100,
      bestScore: 200,
      over: false,
      won: false,
    };

    it('ST-008: should save game state to localStorage', () => {
      saveGameState(mockGameState);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        '2048_game_state',
        JSON.stringify(mockGameState)
      );
    });

    it('ST-009: should retrieve saved state correctly', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockGameState));
      const retrieved = getGameState();
      expect(retrieved).toEqual(mockGameState);
    });

    it('ST-010: should return null when no state is saved', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const retrieved = getGameState();
      expect(retrieved).toBeNull();
    });

    it('ST-011: should preserve tile properties including mergedFrom', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockGameState));
      const retrieved = getGameState();
      expect(retrieved?.tiles[1].mergedFrom).toBeDefined();
      expect(retrieved?.tiles[1].mergedFrom).toHaveLength(2);
      expect(retrieved?.tiles[1].mergedFrom![0].id).toBe('tile-3');
    });

    it('ST-012: should persist scores correctly', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockGameState));
      const retrieved = getGameState();
      expect(retrieved?.score).toBe(100);
      expect(retrieved?.bestScore).toBe(200);
    });

    it('should handle over and won flags', () => {
      const gameOverState: GameState = {
        tiles: [],
        score: 500,
        bestScore: 500,
        over: true,
        won: false,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(gameOverState));
      const retrieved = getGameState();
      expect(retrieved?.over).toBe(true);
      expect(retrieved?.won).toBe(false);
    });

    it('should handle won state', () => {
      const wonState: GameState = {
        tiles: [
          {
            id: 'tile-2048',
            value: 2048,
            position: { x: 3, y: 3 },
          },
        ],
        score: 10000,
        bestScore: 10000,
        over: false,
        won: true,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(wonState));
      const retrieved = getGameState();
      expect(retrieved?.won).toBe(true);
      expect(retrieved?.tiles[0].value).toBe(2048);
    });

    it('should handle empty tiles array', () => {
      const emptyState: GameState = {
        tiles: [],
        score: 0,
        bestScore: 0,
        over: false,
        won: false,
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(emptyState));
      const retrieved = getGameState();
      expect(retrieved?.tiles).toEqual([]);
    });
  });
});
