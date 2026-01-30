import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Board } from '../Board/Board';
import type { Tile } from '../../utils/gameLogic';

describe('Board Component', () => {
  let mockOnMove: Mock<(direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void>;

  beforeEach(() => {
    mockOnMove = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Rendering ====================
  describe('rendering', () => {
    it('CP-005: should render board structure', () => {
      const { container } = render(<Board tiles={[]} onMove={mockOnMove} />);
      // Should have board container
      const boardDiv = container.querySelector('div');
      expect(boardDiv).toBeInTheDocument();
    });

    it('CP-006: should render all tiles', () => {
      const tiles: Tile[] = [
        { id: '1', value: 2, position: { x: 0, y: 0 } },
        { id: '2', value: 4, position: { x: 1, y: 0 } },
        { id: '3', value: 8, position: { x: 2, y: 0 } },
      ];
      render(<Board tiles={tiles} onMove={mockOnMove} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should render tiles with mergedFrom for animation', () => {
      const tiles: Tile[] = [
        {
          id: 'merged',
          value: 4,
          position: { x: 0, y: 0 },
          mergedFrom: [
            { id: '1', value: 2, position: { x: 0, y: 0 } },
            { id: '2', value: 2, position: { x: 1, y: 0 } },
          ],
        },
      ];
      render(<Board tiles={tiles} onMove={mockOnMove} />);
      // Should render the merged tile
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('should not crash with empty tiles array', () => {
      expect(() => {
        render(<Board tiles={[]} onMove={mockOnMove} />);
      }).not.toThrow();
    });
  });

  // ==================== Keyboard Events ====================
  describe('keyboard events', () => {
    it('CP-007: should call onMove with LEFT when ArrowLeft is pressed', () => {
      render(<Board tiles={[]} onMove={mockOnMove} />);
      fireEvent.keyDown(window, { key: 'ArrowLeft' });
      expect(mockOnMove).toHaveBeenCalledWith('LEFT');
    });

    it('should call onMove with RIGHT when ArrowRight is pressed', () => {
      render(<Board tiles={[]} onMove={mockOnMove} />);
      fireEvent.keyDown(window, { key: 'ArrowRight' });
      expect(mockOnMove).toHaveBeenCalledWith('RIGHT');
    });

    it('should call onMove with UP when ArrowUp is pressed', () => {
      render(<Board tiles={[]} onMove={mockOnMove} />);
      fireEvent.keyDown(window, { key: 'ArrowUp' });
      expect(mockOnMove).toHaveBeenCalledWith('UP');
    });

    it('should call onMove with DOWN when ArrowDown is pressed', () => {
      render(<Board tiles={[]} onMove={mockOnMove} />);
      fireEvent.keyDown(window, { key: 'ArrowDown' });
      expect(mockOnMove).toHaveBeenCalledWith('DOWN');
    });

    it('should not call onMove for non-arrow keys', () => {
      render(<Board tiles={[]} onMove={mockOnMove} />);
      fireEvent.keyDown(window, { key: 'a' });
      expect(mockOnMove).not.toHaveBeenCalled();
    });
  });

  // ==================== Cleanup ====================
  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = render(<Board tiles={[]} onMove={mockOnMove} />);
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });
  });
});
