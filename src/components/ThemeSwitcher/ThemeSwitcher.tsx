import React, { useState, useEffect, useRef } from 'react';
import { getTheme, setTheme } from '../../utils/storage';
import { THEMES, DEFAULT_THEME, isValidTheme, type ThemeId } from '../../utils/themeConfig';
import styles from './ThemeSwitcher.module.css';

export const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const saved = getTheme();
    return isValidTheme(saved) ? saved : DEFAULT_THEME;
  });
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    setTheme(currentTheme);
  }, [currentTheme]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleThemeSelect = (themeId: ThemeId) => {
    setCurrentTheme(themeId);
    setIsOpen(false);
  };

  const getCurrentTheme = () => {
    return THEMES.find(t => t.id === currentTheme);
  };

  const currentThemeData = getCurrentTheme();

  return (
    <div className={styles.container} ref={modalRef}>
      <button
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerIcon}>{currentThemeData?.emoji}</span>
        <span className={styles.triggerText}>{currentThemeData?.name}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>▼</span>
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Choose Theme</h3>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className={styles.themeGrid}>
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  className={`${styles.themeCard} ${currentTheme === theme.id ? styles.themeCardActive : ''}`}
                  onClick={() => handleThemeSelect(theme.id)}
                  title={theme.description}
                >
                  <span className={styles.themeEmoji}>{theme.emoji}</span>
                  <span className={styles.themeName}>{theme.shortName}</span>
                  {currentTheme === theme.id && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
