import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher';
import * as storage from '../../utils/storage';

// Mock storage module
vi.mock('../../utils/storage', () => ({
  getTheme: vi.fn(() => 'candy'),
  setTheme: vi.fn(),
}));

describe('ThemeSwitcher Component', () => {
  let mockGetTheme: ReturnType<typeof vi.fn>;
  let mockSetTheme: ReturnType<typeof vi.fn>;
  let mockSetAttribute: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockGetTheme = storage.getTheme as ReturnType<typeof vi.fn>;
    mockSetTheme = storage.setTheme as ReturnType<typeof vi.fn>;
    mockSetAttribute = vi.fn();

    // Mock document.documentElement.setAttribute
    Object.defineProperty(document.documentElement, 'setAttribute', {
      value: mockSetAttribute,
      writable: true,
    });

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==================== Basic Rendering ====================
  describe('rendering', () => {
    it('should render theme selector', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should display theme label', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByText('Theme')).toBeInTheDocument();
    });

    it('should render all theme options', () => {
      render(<ThemeSwitcher />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(12);
    });

    it('should display theme names with emojis', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByText('🍬 Candy')).toBeInTheDocument();
      expect(screen.getByText('🌿 Mint')).toBeInTheDocument();
      expect(screen.getByText('🍎 Apple')).toBeInTheDocument();
      expect(screen.getByText('🎋 Bamboo')).toBeInTheDocument();
      expect(screen.getByText('🧧 Festive')).toBeInTheDocument();
    });
  });

  // ==================== Theme Switching ====================
  describe('theme switching', () => {
    it('should change from candy to mint', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const select = screen.getByRole('combobox');

      await user.selectOptions(select, 'mint');

      expect(mockSetTheme).toHaveBeenCalledWith('mint');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'mint');
    });

    it('should change to apple theme', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const select = screen.getByRole('combobox');

      await user.selectOptions(select, 'apple');

      expect(mockSetTheme).toHaveBeenCalledWith('apple');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'apple');
    });

    it('should change to cyberpunk theme', async () => {
      mockGetTheme.mockReturnValue('apple');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const select = screen.getByRole('combobox');

      await user.selectOptions(select, 'cyberpunk');

      expect(mockSetTheme).toHaveBeenCalledWith('cyberpunk');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'cyberpunk');
    });

    it('should handle multiple theme changes', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const select = screen.getByRole('combobox');

      // First change: candy -> apple
      await user.selectOptions(select, 'apple');
      expect(mockSetTheme).toHaveBeenLastCalledWith('apple');

      // Second change: apple -> zelda
      await user.selectOptions(select, 'zelda');
      expect(mockSetTheme).toHaveBeenLastCalledWith('zelda');
    });
  });

  // ==================== Initial Theme ====================
  describe('initial theme', () => {
    it('CP-012: should set initial theme on mount from storage', () => {
      mockGetTheme.mockReturnValue('mint');
      render(<ThemeSwitcher />);

      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'mint');
    });

    it('should use candy theme when no theme is stored', () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'candy');
    });

    it('should select current theme in dropdown', () => {
      mockGetTheme.mockReturnValue('mint');
      render(<ThemeSwitcher />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('mint');
    });
  });

  // ==================== Storage Integration ====================
  describe('storage integration', () => {
    it('should save new theme to storage', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const select = screen.getByRole('combobox');

      await user.selectOptions(select, 'witcher');

      expect(mockSetTheme).toHaveBeenCalledWith('witcher');
    });

    it('should save theme to storage on initial mount', () => {
      mockGetTheme.mockReturnValue('zelda');
      render(<ThemeSwitcher />);

      expect(mockSetTheme).toHaveBeenCalledWith('zelda');
    });
  });

  // ==================== All Themes ====================
  describe('all themes available', () => {
    const allThemes = [
      'candy', 'mint', 'apple', 'bamboo', 'festive', 'ink',
      'cyberpunk', 'steampunk', 'witcher', 'zelda', 'mario', 'microsoft'
    ];

    it('should have all theme options available', () => {
      render(<ThemeSwitcher />);

      allThemes.forEach(themeId => {
        const option = screen.getByRole('option', { name: new RegExp(themeId, 'i') });
        expect(option).toBeInTheDocument();
      });
    });
  });
});
