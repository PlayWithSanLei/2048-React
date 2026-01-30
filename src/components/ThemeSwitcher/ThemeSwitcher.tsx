import React from 'react';
import { getTheme, setTheme } from '../../utils/storage';
import styles from './ThemeSwitcher.module.css';

export const ThemeSwitcher: React.FC = () => {
  const toggleTheme = () => {
    const current = getTheme();
    const next = current === 'candy' ? 'mint' : 'candy';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Set initial theme on mount
  React.useEffect(() => {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <button className={styles.button} onClick={toggleTheme}>
      Switch Theme
    </button>
  );
};
