import React from 'react';
import classNames from 'classnames';
import type { Tile as TileType } from '../../utils/gameLogic';
import styles from './Tile.module.css';

interface TileProps {
  tile: TileType;
}

export const Tile: React.FC<TileProps> = ({ tile }) => {
  const { value, position, isNew, mergedFrom } = tile;
  
  // Calculate position styles
  const style = {
    '--x': position.x,
    '--y': position.y,
  } as React.CSSProperties;

  const classes = classNames(styles.tile, styles[`tile-${value}`], {
    [styles.new]: isNew,
    [styles.merged]: !!mergedFrom,
    [styles.super]: value > 2048,
  });

  return (
    <div className={classes} style={style}>
      <div className={styles.inner}>
        {value}
      </div>
    </div>
  );
};
