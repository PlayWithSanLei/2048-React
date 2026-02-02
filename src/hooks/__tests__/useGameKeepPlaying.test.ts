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

describe('useGame Keep Playing Feature', () => {
  let mockGetGameState: ReturnType<typeof vi.fn>;
  let mockSaveGameState: ReturnType<typeof vi.fn>;
  let mockGenerateRandomTile: ReturnType<typeof vi.fn>;
  let mockGetEmptyGrid: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGetGameState = storage.getGameState as ReturnType<typeof vi.fn>;
    mockSaveGameState = storage.saveGameState as ReturnType<typeof vi.fn>;
    mockGenerateRandomTile = gameLogic.generateRandomTile as ReturnType<typeof vi.fn>;
    mockGetEmptyGrid = gameLogic.getEmptyGrid as ReturnType<typeof vi.fn>;

    vi.clearAllMocks();

    mockGetGameState.mockReturnValue(null);
    
    const emptyGrid: gameLogic.Grid = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => null)
    );
    mockGetEmptyGrid.mockReturnValue(emptyGrid);

    mockGenerateRandomTile.mockReturnValue({
      id: 'tile-1',
      value: 2,
      position: { x: 0, y: 0 },
      isNew: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize keepPlaying as false by default', async () => {
    const { result } = renderHook(() => useGame());

    await waitFor(() => {
      expect(result.current.keepPlaying).toBe(false);
    });
  });

  it('should set keepPlaying to true when continueGame is called', async () => {
    const { result } = renderHook(() => useGame());

    await waitFor(() => {
      expect(result.current.keepPlaying).toBe(false);
    });

    act(() => {
      result.current.continueGame();
    });

    expect(result.current.keepPlaying).toBe(true);
  });

  it('should reset keepPlaying to false when startNewGame is called', async () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.continueGame();
    });

    expect(result.current.keepPlaying).toBe(true);

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.keepPlaying).toBe(false);
  });

  it('should load keepPlaying state from storage', async () => {
    mockGetGameState.mockReturnValue({
      tiles: [],
      score: 100,
      bestScore: 200,
      over: false,
      won: true,
      keepPlaying: true,
    });

    const { result } = renderHook(() => useGame());

    await waitFor(() => {
      expect(result.current.keepPlaying).toBe(true);
    });
  });

  it('should save keepPlaying state to storage', async () => {
    const { result } = renderHook(() => useGame());

    await waitFor(() => {
      expect(result.current.keepPlaying).toBe(false);
    });

    act(() => {
      result.current.continueGame();
    });

    expect(mockSaveGameState).toHaveBeenCalledWith(
      expect.objectContaining({
        keepPlaying: true,
      })
    );
  });
});
