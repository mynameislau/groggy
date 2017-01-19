import React from 'react';

export default ({ fColor, bgColor, changeFColorHandler, changeBGColorHandler }) =>
  <ul className="colors-panel">
    <li><input className="color-picker" type="color" value={fColor} onChange={changeFColorHandler}/></li>
    <li><input className="color-picker" type="color" value={bgColor} onChange={changeBGColorHandler}/></li>
  </ul>;
