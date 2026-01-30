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
    it('should render switch button', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should display button text', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByText('Switch Theme')).toBeInTheDocument();
    });
  });

  // ==================== Theme Switching ====================
  describe('theme switching', () => {
    it('CP-011: should toggle from candy to mint', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('mint');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'mint');
    });

    it('should toggle from mint to candy', async () => {
      mockGetTheme.mockReturnValue('mint');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('candy');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'candy');
    });

    it('should handle multiple toggles', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      const button = screen.getByRole('button');

      // First toggle: candy -> mint
      await user.click(button);
      expect(mockSetTheme).toHaveBeenLastCalledWith('mint');

      // Mock return value changed
      mockGetTheme.mockReturnValue('mint');

      // Second toggle: mint -> candy
      await user.click(button);
      expect(mockSetTheme).toHaveBeenLastCalledWith('candy');
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
  });

  // ==================== Storage Integration ====================
  describe('storage integration', () => {
    it('should save new theme to storage', async () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const user = userEvent.setup();
      await user.click(screen.getByRole('button'));

      expect(mockSetTheme).toHaveBeenCalled();
    });
  });
});
