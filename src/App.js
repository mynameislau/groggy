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

const rogueMap = setCoords(R.times(
  () => R.times(
    () => ({ symbol: ' ', fcolor: 'red', bgcolor: 'black' })
  , exampleW)
, exampleH));

const brushes = [' ', '@', '*'];

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
        console.log('oui');
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
    console.log(this.state.fcolor);
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ul>
          <li><input className="colorPicker" type="color" value={this.state.fcolor} onInput={(event) => this.changeColor(event.target.value, 'fcolor')}/></li>
          <li><input className="colorPicker" type="color" value={this.state.bgcolor} onInput={(event) => this.changeColor(event.target.value, 'bgcolor')}/></li>
        </ul>
        <ul className="brushes">{
            brushes.map(val =>
              <li><button onClick={() => this.changeBrush(val)}>{val}</button></li>)
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
      </div>
    );
  }
}

export default App;
