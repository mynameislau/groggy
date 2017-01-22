import React from 'react';

export default ({exportHandler, stashHandler, clearHandler}) =>
  <div className="functions-panel">
    <button onClick={stashHandler}>Stash</button>
    <button onClick={exportHandler}>Export</button>
    <button onClick={clearHandler}>Clear</button>
  </div>;
