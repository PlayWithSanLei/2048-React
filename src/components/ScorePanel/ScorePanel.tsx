import React, { useEffect, useState } from 'react';
import styles from './ScorePanel.module.css';

interface ScorePanelProps {
  score: number;
  bestScore: number;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, bestScore }) => {
  const [scoreIncrease, setScoreIncrease] = useState<number | null>(null);

  // Simple effect to show score increase
  // In a real app we might want to track previous score to calculate diff
  // For now let's just use a key or simple state trigger if we want to animate
  // But since we receive `score` as prop, we can detect change.
  
  // Actually, to show "+4", we need to know the diff.
  // We can use a ref to store prev score.
  const prevScoreRef = React.useRef(score);

  useEffect(() => {
    const diff = score - prevScoreRef.current;
    if (diff > 0) {
      setScoreIncrease(diff);
      const timer = setTimeout(() => setScoreIncrease(null), 600);
      return () => clearTimeout(timer);
    }
    prevScoreRef.current = score;
  }, [score]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.label}>SCORE</div>
        <div className={styles.value}>{score}</div>
        {scoreIncrease && (
          <div className={styles.addition} key={score}>+{scoreIncrease}</div>
        )}
      </div>
      <div className={styles.box}>
        <div className={styles.label}>BEST</div>
        <div className={styles.value}>{bestScore}</div>
      </div>
    </div>
  );
};
