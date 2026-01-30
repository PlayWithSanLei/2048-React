import React from 'react';
import { useGame } from './hooks/useGame';
import { Board } from './components/Board/Board';
import { ScorePanel } from './components/ScorePanel/ScorePanel';
import { ThemeSwitcher } from './components/ThemeSwitcher/ThemeSwitcher';
import styles from './App.module.css';
import './styles/globals.css';

const App: React.FC = () => {
  const { tiles, score, bestScore, over, won, moveTiles, startNewGame } = useGame();

  return (
    <div className={styles.container}>
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
        <ThemeSwitcher />
        <button className={styles.restartButton} onClick={startNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default App;
