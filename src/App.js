import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import R from 'ramda';
import { IO } from 'ramda-fantasy';

import Canvas from './components/canvas';
import SwatchesPanel from './components/swatches-panel';
import BrushesPanel from './components/brushes-panel';
import ColorsPanel from './components/colors-panel';

const trace = x => {
  console.log(x);

  return x;
};

const brushes = '▩≋◸≉"@ ./+-#&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

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
      symbol: '@',
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
            R.assoc('symbol', this.state.symbol),
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

  changeSymbol (symbol) {
    console.log(symbol);
    this.setState({
      symbol: symbol
    })
  }

  changeColor (color, key) {
    console.log(color, key);
    this.setState(R.assoc(key, color, {}));
  }

  setBrush (brush) {
    this.setState({ symbol: brush.symbol, fcolor: brush.fcolor, bgcolor: brush.bgcolor })
  }

  render () {
    return (
      <div className="ui">
        <div className="l-panel">
          <ColorsPanel
            fColor={this.state.fcolor}
            bgColor={this.state.bgColor}
            changeFColorHandler={(event) => this.changeColor(event.target.value, 'fcolor')}
            changeBGColorHandler={(event) => this.changeColor(event.target.value, 'bgcolor')}
          />
          <BrushesPanel brushes={brushes} clickHandler={this.changeSymbol} />
        </div>
        <div className="c-panel">
          <Canvas mouseDownHandler={this.mouseDownHandler} grid={this.state.rogueMap}/>
        </div>
        <div className="r-panel">
          <SwatchesPanel swatches={swatches(R.unnest(this.state.rogueMap))} clickHandler={this.setBrush}/>
      </div>
      </div>
    );
  }
}

export default App;
