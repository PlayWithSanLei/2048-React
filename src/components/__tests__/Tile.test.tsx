import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tile } from '../Tile/Tile';

describe('Tile Component', () => {
  // ==================== Basic Rendering ====================
  describe('rendering', () => {
    it('CP-001: should render tile with correct value', () => {
      const mockTile = {
        id: 'tile-1',
        value: 2,
        position: { x: 0, y: 0 },
      };
      render(<Tile tile={mockTile} />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should render tile with value 2048', () => {
      const mockTile = {
        id: 'tile-2048',
        value: 2048,
        position: { x: 3, y: 3 },
      };
      render(<Tile tile={mockTile} />);
      expect(screen.getByText('2048')).toBeInTheDocument();
    });

    it('should render tile with value 4096 (super tile)', () => {
      const mockTile = {
        id: 'tile-4096',
        value: 4096,
        position: { x: 0, y: 0 },
      };
      const { container } = render(<Tile tile={mockTile} />);
      expect(screen.getByText('4096')).toBeInTheDocument();
      // Super tiles should have different styling
      const tileDiv = container.querySelector('div > div');
      expect(tileDiv).toBeInTheDocument();
    });
  });

  // ==================== CSS Variables ====================
  describe('CSS variables for position', () => {
    it('should set correct CSS variables for position', () => {
      const mockTile = {
        id: 'tile-1',
        value: 2,
        position: { x: 2, y: 3 },
      };
      const { container } = render(<Tile tile={mockTile} />);
      const tileElement = container.firstChild as HTMLElement;
      expect(tileElement.style.getPropertyValue('--x')).toBe('2');
      expect(tileElement.style.getPropertyValue('--y')).toBe('3');
    });

    it('should render with inner container', () => {
      const mockTile = {
        id: 'tile-1',
        value: 2,
        position: { x: 0, y: 0 },
      };
      const { container } = render(<Tile tile={mockTile} />);
      // Should have outer div and inner div structure
      const outerDiv = container.firstChild as HTMLElement;
      expect(outerDiv).toBeInTheDocument();
      expect(outerDiv?.children.length).toBe(1);
    });
  });

  // ==================== Value-specific Classes ====================
  describe('value-specific rendering', () => {
    it.each([
      [2, '2'],
      [4, '4'],
      [8, '8'],
      [16, '16'],
      [32, '32'],
      [64, '64'],
      [128, '128'],
      [256, '256'],
      [512, '512'],
      [1024, '1024'],
      [2048, '2048'],
    ])('should render tile with value %s', (value, text) => {
      const mockTile = {
        id: `tile-${value}`,
        value: value as number,
        position: { x: 0, y: 0 },
      };
      render(<Tile tile={mockTile} />);
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  // ==================== Tile Properties ====================
  describe('tile properties', () => {
    it('should render new tile', () => {
      const mockTile = {
        id: 'tile-1',
        value: 2,
        position: { x: 0, y: 0 },
        isNew: true,
      };
      const { container } = render(<Tile tile={mockTile} />);
      expect(screen.getByText('2')).toBeInTheDocument();
      // isNew flag is used for CSS animation
      const tileDiv = container.firstChild as HTMLElement;
      expect(tileDiv).toBeInTheDocument();
    });

    it('CP-004: should render merged tile', () => {
      const mockTile = {
        id: 'tile-merged',
        value: 4,
        position: { x: 0, y: 0 },
        mergedFrom: [
          { id: 'tile-1', value: 2, position: { x: 0, y: 0 } },
          { id: 'tile-2', value: 2, position: { x: 1, y: 0 } },
        ],
      };
      const { container } = render(<Tile tile={mockTile} />);
      expect(screen.getByText('4')).toBeInTheDocument();
      // mergedFrom is used for CSS animation
      const tileDiv = container.firstChild as HTMLElement;
      expect(tileDiv).toBeInTheDocument();
    });

    it('should render tile at correct position', () => {
      const mockTile = {
        id: 'tile-1',
        value: 2,
        position: { x: 3, y: 3 },
      };
      const { container } = render(<Tile tile={mockTile} />);
      const tileElement = container.firstChild as HTMLElement;
      expect(tileElement.style.getPropertyValue('--x')).toBe('3');
      expect(tileElement.style.getPropertyValue('--y')).toBe('3');
    });
  });
});
