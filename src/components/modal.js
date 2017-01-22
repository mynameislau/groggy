import React from 'react';

export default ({ message }) =>
message ?
  <div className="modal">
    <code>
      {message}
    </code>
  </div>
  : null;
