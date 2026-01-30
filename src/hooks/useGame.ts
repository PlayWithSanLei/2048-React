import { useState, useEffect, useCallback } from 'react';
import {
  move,
  generateRandomTile,
  getEmptyGrid,
  hasMoves,
} from '../utils/gameLogic';
import type {
  Tile,
  Direction,
  GameState,
} from '../utils/gameLogic';
import {
  getBestScore,
  setBestScore,
  getGameState,
  saveGameState,
} from '../utils/storage';

export const useGame = () => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScoreState] = useState(getBestScore());
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const startNewGame = useCallback(() => {
    const t1 = generateRandomTile(getEmptyGrid());
    
    // We need to construct a grid that has t1 to ensure t2 doesn't spawn on top if using `getEmptyGrid` logic naively,
    // but `generateRandomTile` takes a grid.
    
    // Let's do it properly:
    const grid = getEmptyGrid();
    if (t1) grid[t1.position.y][t1.position.x] = t1;
    
    const t2 = generateRandomTile(grid);
    
    const initialTiles = [];
    if (t1) initialTiles.push(t1);
    if (t2) initialTiles.push(t2);

    setTiles(initialTiles);
    setScore(0);
    setOver(false);
    setWon(false);
  }, []);

  // Initialize game
  useEffect(() => {
    const savedState = getGameState();
    if (savedState) {
      setTiles(savedState.tiles);
      setScore(savedState.score);
      setBestScoreState(savedState.bestScore);
      setOver(savedState.over);
      setWon(savedState.won);
    } else {
      startNewGame();
    }
    setInitialized(true);
  }, [startNewGame]);

  // Save state on change
  useEffect(() => {
    if (!initialized) return;
    const state: GameState = {
      tiles,
      score,
      bestScore,
      over,
      won,
    };
    saveGameState(state);
    
    if (score > bestScore) {
      setBestScore(score);
      setBestScoreState(score);
    }
  }, [tiles, score, bestScore, over, won, initialized]);

  const moveTiles = useCallback((direction: Direction) => {
    if (over || (!won && !hasMoves(tiles) && tiles.length > 0)) {
        // Double check over state
        if (!over) setOver(true);
        return;
    }
    if (over) return;

    const result = move(tiles, direction);

    if (result.moved) {
      const newScore = score + result.scoreIncrease;
      setScore(newScore);

      // Check for 2048
      if (!won && result.tiles.some((t) => t.value === 2048)) {
        setWon(true);
      }

      // Add new tile
      // Construct grid from result tiles
      const grid = getEmptyGrid();
      result.tiles.forEach(t => grid[t.position.y][t.position.x] = t);
      
      const newTile = generateRandomTile(grid);
      if (newTile) {
        result.tiles.push(newTile);
      }

      setTiles(result.tiles);

      // Check game over
      if (!hasMoves(result.tiles)) {
        setOver(true);
      }
    }
  }, [tiles, score, over, won]);

  return {
    tiles,
    score,
    bestScore,
    over,
    won,
    moveTiles,
    startNewGame,
  };
};
