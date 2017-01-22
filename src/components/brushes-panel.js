import React from 'react';

export default ({ symbol, symbols, clickHandler, fColor, bgColor }) =>
  <ul className="brushes-panel">{
    symbols.map(val =>
      <li key={val} className={`brushes-panel__entry ${symbol === val ? 'brushes-panel__entry--active' : ''}`}>
        <button
        className="brush-btn"
        style={{backgroundColor: bgColor, color: fColor }}
        onClick={() => clickHandler(val)}
        aria-selected={symbol === val ? 'true' : 'false'}
        >
          {val}
        </button>
      </li>)
    }
  </ul>;
