import React from 'react';

export default ({ brushes, clickHandler, fColor, bgColor }) =>
  <ul className="brushes-panel">{
    brushes.map(val =>
      <li key={val} className="brushes-panel__entry">
        <button
        className="brush-btn"
        style={{backgroundColor: bgColor, color: fColor }}
        onClick={() => clickHandler(val)}
        >
          {val}
        </button>
      </li>)
    }
  </ul>;
