import React from 'react';

export default ({toolSelectHandler, currentTool}) =>
  <div className="tools-panel">
    <button
    onClick={() => toolSelectHandler('pen')}
    className="tools-panel__btn"
    aria-selected={currentTool === 'pen' ? 'true' : 'false'}
    >
      Pen
    </button>
    <button
    onClick={() => toolSelectHandler('bucket')}
    className="tools-panel__btn"
    aria-selected={currentTool === 'bucket' ? 'true' : 'false'}
    >
      Bucket
    </button>
  </div>;
