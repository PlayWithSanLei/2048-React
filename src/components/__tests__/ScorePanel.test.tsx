import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ScorePanel } from '../ScorePanel/ScorePanel';

describe('ScorePanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==================== Basic Rendering ====================
  describe('rendering', () => {
    it('CP-009: should display score and best score', () => {
      render(<ScorePanel score={100} bestScore={200} />);
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should display labels', () => {
      render(<ScorePanel score={100} bestScore={200} />);
      expect(screen.getByText('SCORE')).toBeInTheDocument();
      expect(screen.getByText('BEST')).toBeInTheDocument();
    });

    it('should display zero scores', () => {
      render(<ScorePanel score={0} bestScore={0} />);
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ==================== Score Increase Animation ====================
  describe('score increase animation', () => {
    it('CP-010: should show score increase when score changes', async () => {
      const { rerender } = render(<ScorePanel score={0} bestScore={100} />);
      expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();

      rerender(<ScorePanel score={50} bestScore={100} />);

      await waitFor(() => {
        expect(screen.getByText('+50')).toBeInTheDocument();
      });
    });

    it('should not show score increase when score decreases', async () => {
      const { rerender } = render(<ScorePanel score={100} bestScore={200} />);
      rerender(<ScorePanel score={50} bestScore={200} />);

      await waitFor(() => {
        expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
      });
    });

    it('should not show score increase when score stays same', async () => {
      const { rerender } = render(<ScorePanel score={100} bestScore={200} />);
      rerender(<ScorePanel score={100} bestScore={200} />);

      await waitFor(() => {
        expect(screen.queryByText(/\+\d/)).not.toBeInTheDocument();
      });
    });

    it('should hide score increase after animation', async () => {
      const { rerender } = render(<ScorePanel score={0} bestScore={100} />);
      rerender(<ScorePanel score={4} bestScore={100} />);

      await waitFor(() => {
        expect(screen.getByText('+4')).toBeInTheDocument();
      });

      // Wait for animation to complete (600ms)
      await waitFor(
        () => {
          expect(screen.queryByText('+4')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );
    });

    it('should show correct increase amount for large scores', async () => {
      const { rerender } = render(<ScorePanel score={1000} bestScore={2000} />);
      rerender(<ScorePanel score={1500} bestScore={2000} />);

      await waitFor(() => {
        expect(screen.getByText('+500')).toBeInTheDocument();
      });
    });
  });

  // ==================== Multiple Score Changes ====================
  describe('multiple score changes', () => {
    it('should handle multiple score increases', async () => {
      const { rerender } = render(<ScorePanel score={0} bestScore={100} />);

      rerender(<ScorePanel score={4} bestScore={100} />);
      await waitFor(() => {
        expect(screen.getByText('+4')).toBeInTheDocument();
      });

      // Wait for the +4 to be cleared (600ms timeout)
      await waitFor(
        () => {
          expect(screen.queryByText('+4')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Now change score again
      rerender(<ScorePanel score={12} bestScore={100} />);
      await waitFor(() => {
        expect(screen.getByText('+12')).toBeInTheDocument();
      });
    });
  });

  // ==================== Edge Cases ====================
  describe('edge cases', () => {
    it('should handle very large scores', () => {
      render(<ScorePanel score={999999} bestScore={999999} />);
      const scores = screen.getAllByText('999999');
      expect(scores.length).toBe(2);
    });

    it('should handle best score lower than current score', () => {
      render(<ScorePanel score={500} bestScore={300} />);
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('300')).toBeInTheDocument();
    });

    it('should handle equal scores', () => {
      render(<ScorePanel score={200} bestScore={200} />);
      const scores = screen.getAllByText('200');
      expect(scores.length).toBeGreaterThanOrEqual(2);
    });
  });
});
