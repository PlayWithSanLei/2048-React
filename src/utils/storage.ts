import type { GameState } from './gameLogic';

const KEY_BEST_SCORE = '2048_best_score';
const KEY_THEME = '2048_theme';
const KEY_GAME_STATE = '2048_game_state';

export const getBestScore = (): number => {
  const score = localStorage.getItem(KEY_BEST_SCORE);
  return score ? parseInt(score, 10) : 0;
};

export const setBestScore = (score: number) => {
  localStorage.setItem(KEY_BEST_SCORE, score.toString());
};

export const getTheme = (): string => {
  return localStorage.getItem(KEY_THEME) || 'candy';
};

export const setTheme = (theme: string) => {
  localStorage.setItem(KEY_THEME, theme);
};

export const saveGameState = (state: GameState) => {
  localStorage.setItem(KEY_GAME_STATE, JSON.stringify(state));
};

export const getGameState = (): GameState | null => {
  const state = localStorage.getItem(KEY_GAME_STATE);
  return state ? JSON.parse(state) : null;
};
