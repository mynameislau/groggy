import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import R from 'ramda';

const trace = x => {
  console.log(x);

  return x;
};

const setCoords = R.compose(
  R.last,
  R.mapAccum((rowAcc, rowVal) => [
    rowAcc + 1,
    R.mapAccum((colAcc, colVal) => [
      colAcc + 1,
      Object.assign({}, colVal, { x: colAcc, y: rowAcc })
    ], 0, rowVal)[1]
  ], 0));

const rogueMap = setCoords(R.times(
  () => R.times(
    () => ({ symbol: ' ', color: 'red' })
  , 32)
, 32));

const brushes = [' ', '@', '*'];

let state = {
  brush: '@',
  fcolor: 'green',
  bgcolor: 'red'
};

const fontSize = 5;

const fullOffset = (offsetName, elm) => {
  let offset = elm[offsetName];
  while (elm.offsetParent != null){
      elm = elm.offsetParent;
      offset = offset + elm[offsetName];
  }
  return offset;
};

const mouseDownHandler = downEvent => {

  const editor = downEvent.currentTarget;

  const mouseMoveHandler = moveEvent => {
    console.log(moveEvent);
    console.log(fullOffset('left', editor));
    debugger;
  };


  const mouseUpHandler = upEvent => {
    console.log(upEvent);
    window.removeEventListener('mousemove', mouseMoveHandler);
  };

  window.addEventListener('mouseup', mouseUpHandler);
  window.addEventListener('mousemove', mouseMoveHandler);
};

class App extends Component {
  render () {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <svg onMouseDown={mouseDownHandler} viewBox="0 0 32 32" width="40em" height="40em" style={{ overflow: 'visible' }}>
            {
              R.compose(
                R.map(cell =>
                  <g>
                    <rect x={cell.x} y={cell.y} width="1" height="1" style={{ stroke: 'grey', strokeWidth: 0.01 }}/>
                    <text style={{ fontSize: `${fontSize}%`, fill: cell.color, fontFamily: 'Hack, monospace' }} x={cell.x + 0.5 - fontSize / 10 / 2} y={cell.y + 0.45 + fontSize / 10 / 2}>{cell.symbol}</text>
                  </g>
                ),
                trace,
                R.unnest
              )(rogueMap)
            }
          </svg>
      </div>
    );
  }
}

export default App;
