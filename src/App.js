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

const brushes = '▩≋◸≉"@ ./+-#&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

const fontSize = 5;

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
    () => ({ symbol: ' ', fcolor: 'red', bgcolor: 'black' })
  , exampleW)
, exampleH));

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rogueMap: rogueMap,
      brush: '@',
      fcolor: '#FF0000',
      bgcolor: '#000000'
    }
  }

  mouseDownHandler = downEvent => {

    let prevXPos = null;
    let prevYPos = null;

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

      if (prevXPos !== xPos || prevYPos !== yPos) {
        this.setState({
          rogueMap: editCell(xPos, yPos, R.compose(
            R.assoc('symbol', this.state.brush),
            R.assoc('fcolor', this.state.fcolor),
            R.assoc('bgcolor',this.state.bgcolor)
          ))(this.state.rogueMap)
        });

        prevXPos = xPos;
        prevYPos = yPos;
      }
    };

    const mouseUpHandler = upEvent => {
      window.removeEventListener('mousemove', mouseMoveHandler);
    };

    window.addEventListener('mouseup', mouseUpHandler);
    window.addEventListener('mousemove', mouseMoveHandler);
  };

  changeBrush (brush) {
    console.log(brush);
    this.setState({
      brush: brush
    })
  }

  changeColor (color, key) {
    console.log(color, key);
    this.setState(R.assoc(key, color, {}));
  }

  render () {
    return (
      <div className="ui">
        <div className="l-panel">
          <ul className="colors-panel">
            <li><input className="color-picker" type="color" value={this.state.fcolor} onChange={(event) => this.changeColor(event.target.value, 'fcolor')}/></li>
            <li><input className="color-picker" type="color" value={this.state.bgcolor} onChange={(event) => this.changeColor(event.target.value, 'bgcolor')}/></li>
          </ul>
          <ul className="brushes-panel">{
            brushes.map(val =>
              <li key={val} className="brushes-panel__entry">
                <button className="brush-btn" onClick={() => this.changeBrush(val)}>{val}</button>
              </li>)
            }
          </ul>
        </div>
        <div className="c-panel">
          <div
          className="canvas"
          style={{ display: 'inline-block' }}
          onMouseDown={this.mouseDownHandler}>
            <svg viewBox={`0 0 ${exampleW} ${exampleH}`} width="40em" height="40em" style={{ overflow: 'visible' }}>
              {
                R.compose(
                  R.map(cell =>
                    <g key={`${cell.x}x${cell.y}`}>
                      <rect x={cell.x} y={cell.y} width="1" height="1" style={{ fill: cell.bgcolor, stroke: 'grey', strokeWidth: 0.01 }}/>
                      <text style={{ fontSize: `${fontSize}%`, fill: cell.fcolor, fontFamily: 'Hack, monospace' }} x={cell.x + 0.5 - fontSize / 10 / 2} y={cell.y + 0.45 + fontSize / 10 / 2}>{cell.symbol}</text>
                    </g>
                  ),
                  R.unnest
                )(this.state.rogueMap)
              }
            </svg>
          </div>
        </div>
        <div className="r-panel">
          <ul className="swatches-panel">
            {
              swatches(R.unnest(this.state.rogueMap)).map(cell =>
                <li className="swatches-panel__entry" key={`${cell.symbol} ${cell.bgcolor} ${cell.fcolor}`}className="brushes-panel__entry">
                  <button onClick={() => this.setState({ brush: cell.symbol, fcolor: cell.fcolor, bgcolor: cell.bgcolor })} style={{ backgroundColor: cell.bgcolor, color: cell.fcolor }} className="brush-btn">
                    {cell.symbol}
                  </button>
                </li>
              )
            }
          </ul>
      </div>
      </div>
    );
  }
}

export default App;
