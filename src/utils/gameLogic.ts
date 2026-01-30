import { v4 as uuidv4 } from 'uuid';

export interface Position {
  x: number;
  y: number;
}

export interface Tile {
  id: string;
  value: number;
  position: Position;
  mergedFrom?: Tile[];
  isNew?: boolean;
}

export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
}

export type Grid = (Tile | null)[][];

export const GRID_SIZE = 4;

export const getEmptyGrid = (): Grid => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
};

export const getEmptyCells = (grid: Grid): Position[] => {
  const cells: Position[] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (!grid[y][x]) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
};

export const getRandomEmptyCell = (grid: Grid): Position | null => {
  const cells = getEmptyCells(grid);
  if (cells.length === 0) return null;
  return cells[Math.floor(Math.random() * cells.length)];
};

export const generateRandomTile = (grid: Grid): Tile | null => {
  const position = getRandomEmptyCell(grid);
  if (!position) return null;

  return {
    id: uuidv4(),
    value: Math.random() < 0.9 ? 2 : 4,
    position,
    isNew: true,
  };
};

export const arePositionsEqual = (p1: Position, p2: Position): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};

// Rotate grid to simplify move logic (always move left)
const rotateLeft = (grid: Grid): Grid => {
  const newGrid = getEmptyGrid();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      newGrid[GRID_SIZE - 1 - x][y] = grid[y][x]; // Correct CCW
    }
  }
  return newGrid;
};

const rotateRight = (grid: Grid): Grid => {
  const newGrid = getEmptyGrid();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      newGrid[x][GRID_SIZE - 1 - y] = grid[y][x]; // Correct CW
    }
  }
  return newGrid;
};

// Helper to check if moves are available
export const hasMoves = (tiles: Tile[]): boolean => {
  if (tiles.length < GRID_SIZE * GRID_SIZE) return true;

  // Build grid for easy adjacency check
  const grid = getEmptyGrid();
  tiles.forEach((tile) => {
    grid[tile.position.y][tile.position.x] = tile;
  });

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const current = grid[y][x];
      if (!current) return true;

      // Check right
      if (x < GRID_SIZE - 1) {
        const right = grid[y][x + 1];
        if (right && right.value === current.value) return true;
      }

      // Check down
      if (y < GRID_SIZE - 1) {
        const down = grid[y + 1][x];
        if (down && down.value === current.value) return true;
      }
    }
  }
  return false;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface MoveResult {
  tiles: Tile[];
  scoreIncrease: number;
  moved: boolean;
}

export const move = (currentTiles: Tile[], direction: Direction): MoveResult => {
  // 1. Map tiles to grid with clean copies
  let grid = getEmptyGrid();
  currentTiles.forEach((tile) => {
    // Create a clean copy with original position for each grid cell
    const tileCopy: Tile = {
      id: tile.id,
      value: tile.value,
      position: { x: tile.position.x, y: tile.position.y },
    };
    grid[tile.position.y][tile.position.x] = tileCopy;
  });

  // 2. Rotate grid so we always process as "move left"
  // When rotating, we create new tile objects with updated positions
  const rotateWithPositions = (inputGrid: Grid, rotationFn: (g: Grid) => Grid): Grid => {
    const rotated = rotationFn(inputGrid);
    // Update position properties to match grid positions
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const tile = rotated[y][x];
        if (tile) {
          // Create new object with updated position
          rotated[y][x] = {
            id: tile.id,
            value: tile.value,
            position: { x, y },
          };
        }
      }
    }
    return rotated;
  };

  if (direction === 'UP') {
    grid = rotateWithPositions(grid, rotateLeft);
  } else if (direction === 'RIGHT') {
    grid = rotateWithPositions(grid, rotateLeft);
    grid = rotateWithPositions(grid, rotateLeft);
  } else if (direction === 'DOWN') {
    grid = rotateWithPositions(grid, rotateRight);
  }

  // 3. Process each row (move left logic)
  let moved = false;
  let scoreIncrease = 0;
  const nextTiles: Tile[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    const row = grid[y].filter((t) => t !== null) as Tile[];
    const newRow: Tile[] = [];

    let skipNext = false;

    for (let x = 0; x < row.length; x++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const current = row[x];
      const next = row[x + 1];

      if (next && current.value === next.value) {
        // Merge
        const mergedTile: Tile = {
          id: uuidv4(),
          value: current.value * 2,
          position: { x: newRow.length, y },
          mergedFrom: [current, next],
        };
        newRow.push(mergedTile);
        scoreIncrease += mergedTile.value;
        skipNext = true;
        moved = true; // A merge counts as a move
      } else {
        // Check if actually moved (current grid position vs new position)
        // current.position.x is the tile's x in the rotated grid
        // newRow.length is where it will go after compression
        if (current.position.x !== newRow.length) {
          moved = true;
        }
        // Create new tile object with updated position
        newRow.push({
          id: current.id,
          value: current.value,
          position: { x: newRow.length, y },
        });
      }
    }

    // Add processed row to nextTiles
    newRow.forEach(tile => {
      nextTiles.push(tile);
    });
  }

  // 4. Rotate back positions by reconstructing grid and rotating grid

  // Construct grid from nextTiles with clean copies
  let resultGrid = getEmptyGrid();
  nextTiles.forEach(t => {
    const tileCopy: Tile = {
      id: t.id,
      value: t.value,
      position: { x: t.position.x, y: t.position.y },
      mergedFrom: t.mergedFrom,
    };
    resultGrid[t.position.y][t.position.x] = tileCopy;
  });

  // Rotate result grid back (with position updates)
  if (direction === 'UP') {
     resultGrid = rotateWithPositions(resultGrid, rotateRight);
  } else if (direction === 'RIGHT') {
     resultGrid = rotateWithPositions(resultGrid, rotateRight);
     resultGrid = rotateWithPositions(resultGrid, rotateRight);
  } else if (direction === 'DOWN') {
     resultGrid = rotateWithPositions(resultGrid, rotateLeft);
  }

  // Extract tiles with updated positions
  const finalTiles: Tile[] = [];
  for(let y=0; y<GRID_SIZE; y++){
      for(let x=0; x<GRID_SIZE; x++){
          const tile = resultGrid[y][x];
          if(tile){
              finalTiles.push(tile);
          }
      }
  }

  return {
    tiles: finalTiles,
    scoreIncrease,
    moved,
  };
};
