import React, { useEffect, useCallback } from 'react';
import { useGame } from './hooks/useGame';
import { Board } from './components/Board/Board';
import { ScorePanel } from './components/ScorePanel/ScorePanel';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import styles from './App.module.css';
import './styles/globals.css';

const App: React.FC = () => {
  const { tiles, score, bestScore, over, won, moveTiles, startNewGame, undo, canUndo } = useGame();

  // Handle keyboard shortcuts for undo
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Z or Cmd+Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (canUndo) {
        undo();
      }
    }
  }, [canUndo, undo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  return (
    <div className={styles.container}>
      {/* Theme switcher in top right */}
      <div className={styles.topBar}>
        <ThemeSwitcher />
      </div>

      {/* Header with title and scores */}
      <div className={styles.header}>
        <h1 className={styles.title}>2048</h1>
        <ScorePanel score={score} bestScore={bestScore} />
      </div>

      <div className={styles.gameContainer}>
        <Board tiles={tiles} onMove={moveTiles} />

        {(over || won) && (
          <div className={styles.overlay}>
            <div className={styles.message}>
              {won ? 'You Win!' : 'Game Over!'}
            </div>
            <button className={styles.restartButton} onClick={startNewGame}>
              {won ? 'Keep Playing' : 'Try Again'}
            </button>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button
          className={`${styles.undoButton} ${!canUndo ? styles.disabled : ''}`}
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↩ Undo
        </button>
        <button className={styles.restartButton} onClick={startNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default App;
