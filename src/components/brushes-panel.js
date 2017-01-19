import React from 'react';

export default ({ brushes, clickHandler }) =>
  <ul className="brushes-panel">{
    brushes.map(val =>
      <li key={val} className="brushes-panel__entry">
        <button className="brush-btn" onClick={() => clickHandler(val)}>{val}</button>
      </li>)
    }
  </ul>;
