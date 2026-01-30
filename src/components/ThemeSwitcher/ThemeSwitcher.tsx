import React, { useState, useEffect } from 'react';
import { getTheme, setTheme } from '../../utils/storage';
import { THEMES, DEFAULT_THEME, isValidTheme, type ThemeId } from '../../utils/themeConfig';
import styles from './ThemeSwitcher.module.css';

export const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = getTheme();
    return isValidTheme(saved) ? saved : DEFAULT_THEME;
  });

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    setTheme(currentTheme);
  }, [currentTheme]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as ThemeId;
    if (isValidTheme(newTheme)) {
      setCurrentTheme(newTheme);
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="theme-select" className={styles.label}>
        Theme
      </label>
      <select
        id="theme-select"
        className={styles.select}
        value={currentTheme}
        onChange={handleThemeChange}
      >
        {THEMES.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};
