import React from 'react';
import R from 'ramda';
const fontSize = 5;

export default ({ grid, mouseDownHandler }) => {
  const canvasWidth = grid[0].length;
  const canvasHeight = grid.length;

  return <div
  className="canvas"
  style={{ display: 'inline-block' }}
  onMouseDown={mouseDownHandler}>
    <svg viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} width="40em" height="40em" style={{ overflow: 'visible' }}>
      {
        R.compose(
          R.map(cell =>
            <g key={`${cell.x}x${cell.y}`}>
              <rect x={cell.x} y={cell.y} width="1" height="1" style={{ fill: cell.bgColor, stroke: 'grey', strokeWidth: 0.01 }}/>
              <text style={{ fontSize: `${fontSize}%`, fill: cell.fColor, fontFamily: 'Hack, monospace' }} x={cell.x + 0.5 - fontSize / 10 / 2} y={cell.y + 0.45 + fontSize / 10 / 2}>{cell.symbol}</text>
            </g>
          ),
          R.unnest
        )(grid)
      }
    </svg>
  </div>;
}
