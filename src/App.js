import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import R from 'ramda';
import { IO } from 'ramda-fantasy';

const trace = x => {
  console.log(x);

  return x;
};

const exampleW = 32;
const exampleH = 32;

const setCoords = R.compose(
  R.last,
  R.mapAccum((rowAcc, rowVal) => [
    rowAcc + 1,
    R.mapAccum((colAcc, colVal) => [
      colAcc + 1,
      Object.assign({}, colVal, { x: colAcc, y: rowAcc })
    ], 0, rowVal)[1]
  ], 0));

const brushes = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▩≋◸≉"@ ./+-#&'.split('');

const rogueMap = setCoords(R.times(
  () => R.times(
    () => ({ symbol: brushes[Math.round(Math.random() * 5)], fcolor: 'red', bgcolor: 'black' })
  , exampleW)
, exampleH));

const fontSize = 5;

const offsetAncestry = element =>
  element.offsetParent ?
    R.concat([element], offsetAncestry(element.offsetParent)) :
    [element];

const offsetTop = elm => elm.offsetTop;
const offsetLeft = elm => elm.offsetLeft;

const cumulativeOffset = propFn => R.compose(
  R.sum,
  R.map(propFn),
  offsetAncestry
);

const editCell = (x, y, fn) =>
  R.adjust(
    R.adjust(
        fn,
      x),
    y);

const sameColorsAndSymbol = R.curry((a, b) =>
  a.symbol === b.symbol && a.fcolor === b.fcolor && a.bgcolor === b.bgcolor
);

const swatches = R.reduce((acc, val) =>
  R.find(sameColorsAndSymbol(val), acc) ?  acc : R.append(val, acc)
  , []);

console.log(swatches(R.unnest(rogueMap)));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rogueMap: rogueMap,
      brush: '@',
      fcolor: 'green',
      bgcolor: 'red'
    }
  }

  mouseDownHandler = downEvent => {

    const editor = downEvent.currentTarget;

    const mouseMoveHandler = moveEvent => {
      const l = cumulativeOffset(offsetLeft)(editor);
      const t = cumulativeOffset(offsetTop)(editor);
      const w = editor.offsetWidth;
      const h = editor.offsetHeight;
      const x = moveEvent.clientX;
      const y = moveEvent.clientY;

      const xPos = Math.floor((x - l) / w * exampleW);
      const yPos = Math.floor((y - t) / h * exampleH);
      this.setState({
        rogueMap: editCell(xPos, yPos, R.assoc('symbol', this.state.brush))(this.state.rogueMap)
      });
    };

    const mouseUpHandler = upEvent => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
  };

  render () {
    return (
      <div className="ui">
        <ul className="brushes-panel">
          {
            brushes.map(brush =>
              <li className="brushes-panel__entry">
                <button className="brush-btn">
                  {brush}
                </button>
              </li>
            )
          }
        </ul>
        <div
        className="canvas"
        style={{ display: 'inline-block' }}
        onMouseDown={this.mouseDownHandler}>
          <svg viewBox={`0 0 ${exampleW} ${exampleH}`} width="40em" height="40em" style={{ overflow: 'visible' }}>
            {
              R.compose(
                R.map(cell =>
                  <g>
                    <rect x={cell.x} y={cell.y} width="1" height="1" style={{ fill: cell.bgcolor, stroke: 'grey', strokeWidth: 0.01 }}/>
                    <text style={{ fontSize: `${fontSize}%`, fill: cell.fcolor, fontFamily: 'Hack, monospace' }} x={cell.x + 0.5 - fontSize / 10 / 2} y={cell.y + 0.45 + fontSize / 10 / 2}>{cell.symbol}</text>
                  </g>
                ),
                R.unnest
              )(this.state.rogueMap)
            }
          </svg>
        </div>
        <ul className="swatch-panel">
          {
            swatches(R.unnest(this.state.rogueMap)).map(brush =>
              <li className="brushes-panel__entry">
                <button className="brush-btn">
                  {brush.symbol}
                </button>
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default App;
