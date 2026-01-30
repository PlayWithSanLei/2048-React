import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    it('should render trigger button', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByRole('button', { name: /select theme/i })).toBeInTheDocument();
    });

    it('should display current theme emoji and name', () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);
      expect(screen.getByText('🍬')).toBeInTheDocument();
      expect(screen.getByText('Candy')).toBeInTheDocument();
    });

    it('should display arrow icon', () => {
      render(<ThemeSwitcher />);
      expect(screen.getByText('▼')).toBeInTheDocument();
    });
  });

  // ==================== Modal Interaction ====================
  describe('modal interaction', () => {
    it('should open modal when trigger button is clicked', () => {
      render(<ThemeSwitcher />);
      const trigger = screen.getByRole('button', { name: /select theme/i });

      fireEvent.click(trigger);

      expect(screen.getByText('Choose Theme')).toBeInTheDocument();
    });

    it('should render all theme options in grid', () => {
      render(<ThemeSwitcher />);
      const trigger = screen.getByRole('button', { name: /select theme/i });

      fireEvent.click(trigger);

      // Check for theme emojis in the modal (using getAllByText since emoji appears in both trigger and modal)
      expect(screen.getAllByText('🍬')).toHaveLength(2); // trigger + modal
      expect(screen.getByText('🌿')).toBeInTheDocument();
      expect(screen.getByText('🍎')).toBeInTheDocument();
      expect(screen.getByText('🎋')).toBeInTheDocument();
      expect(screen.getByText('🧧')).toBeInTheDocument();

      // Check for theme name in modal
      expect(screen.getByText('Mint')).toBeInTheDocument();
    });
  });

  // ==================== Theme Selection ====================
  describe('theme selection', () => {
    it('should change theme when clicking a theme card', () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const trigger = screen.getByRole('button', { name: /select theme/i });
      fireEvent.click(trigger);

      // Find and click the Mint theme card
      const mintButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Mint'));
      if (mintButton && mintButton !== trigger) {
        fireEvent.click(mintButton);
      }

      expect(mockSetTheme).toHaveBeenCalledWith('mint');
      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'mint');
    });

    it('should close modal after selecting a theme', () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const trigger = screen.getByRole('button', { name: /select theme/i });
      fireEvent.click(trigger);

      const appleButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Apple'));
      if (appleButton && appleButton !== trigger) {
        fireEvent.click(appleButton);
      }

      // Modal should be closed, "Choose Theme" should not be visible
      expect(screen.queryByText('Choose Theme')).not.toBeInTheDocument();
    });
  });

  // ==================== Initial Theme ====================
  describe('initial theme', () => {
    it('CP-012: should set initial theme on mount from storage', () => {
      mockGetTheme.mockReturnValue('mint');
      render(<ThemeSwitcher />);

      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'mint');
      expect(screen.getByText('🌿')).toBeInTheDocument();
      expect(screen.getByText('Mint')).toBeInTheDocument();
    });

    it('should use candy theme when no theme is stored', () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'candy');
      expect(screen.getByText('🍬')).toBeInTheDocument();
    });
  });

  // ==================== Storage Integration ====================
  describe('storage integration', () => {
    it('should save new theme to storage', () => {
      mockGetTheme.mockReturnValue('candy');
      render(<ThemeSwitcher />);

      const trigger = screen.getByRole('button', { name: /select theme/i });
      fireEvent.click(trigger);

      const witcherButton = screen.getAllByRole('button').find(btn => btn.textContent?.includes('Witcher'));
      if (witcherButton && witcherButton !== trigger) {
        fireEvent.click(witcherButton);
      }

      expect(mockSetTheme).toHaveBeenCalledWith('witcher');
    });

    it('should save theme to storage on initial mount', () => {
      mockGetTheme.mockReturnValue('zelda');
      render(<ThemeSwitcher />);

      expect(mockSetTheme).toHaveBeenCalledWith('zelda');
    });
  });
});
