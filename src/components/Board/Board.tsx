import React, { useRef, useEffect } from 'react';
import { useDrag } from '@use-gesture/react';
import type { Tile as TileType } from '../../utils/gameLogic';
import { GRID_SIZE } from '../../utils/gameLogic';
import { Tile } from '../Tile/Tile';
import styles from './Board.module.css';

interface BoardProps {
  tiles: TileType[];
  onMove: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

export const Board: React.FC<BoardProps> = ({ tiles, onMove }) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // Bind gestures
  const bind = useDrag(
    ({ swipe: [swipeX, swipeY] }) => {
      if (swipeX === -1) onMove('LEFT');
      else if (swipeX === 1) onMove('RIGHT');
      else if (swipeY === -1) onMove('UP');
      else if (swipeY === 1) onMove('DOWN');
    },
    {
      threshold: 8,
      swipe: {
        duration: 500,
      },
    }
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onMove('UP');
          break;
        case 'ArrowDown':
          e.preventDefault();
          onMove('DOWN');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onMove('LEFT');
          break;
        case 'ArrowRight':
          e.preventDefault();
          onMove('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove]);

  // Render background grid cells
  const renderGridCells = () => {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      cells.push(<div key={i} className={styles.cell} />);
    }
    return cells;
  };

  // Flatten tiles to include mergedFrom tiles for animation
  const renderTiles = () => {
    const tilesToRender: TileType[] = [];
    
    tiles.forEach(tile => {
      if (tile.mergedFrom) {
        // Add merged tiles, but with the new position so they slide there
        tile.mergedFrom.forEach(mergedTile => {
          tilesToRender.push({
            ...mergedTile,
            position: tile.position, // Move to parent's position
          });
        });
        // Add the merged tile itself (it will pop on top)
        tilesToRender.push(tile);
      } else {
        tilesToRender.push(tile);
      }
    });

    return tilesToRender.map(tile => (
      <Tile key={tile.id} tile={tile} />
    ));
  };

  return (
    <div 
      className={styles.boardContainer}
      {...bind()} 
      ref={boardRef}
      style={{ touchAction: 'none' }} // Crucial for mobile gestures
    >
      <div className={styles.gridContainer}>
        {renderGridCells()}
      </div>
      <div className={styles.tileContainer}>
        {renderTiles()}
      </div>
    </div>
  );
};
