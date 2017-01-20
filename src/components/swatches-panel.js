import React from 'react';

export default ({ clickHandler, swatches}) =>
  <ul className="swatches-panel">
    {
      swatches.map(cell =>
        <li className="swatches-panel__entry" key={`${cell.symbol} ${cell.bgColor} ${cell.fColor}`}className="brushes-panel__entry">
          <button onClick={() => clickHandler(cell)} style={{ backgroundColor: cell.bgColor, color: cell.fColor }} className="brush-btn">
            {cell.symbol}
          </button>
        </li>
      )
    }
  </ul>;
