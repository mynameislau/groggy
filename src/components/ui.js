import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';

import Canvas from './canvas';
import SwatchesPanel from './swatches-panel';
import BrushesPanel from './brushes-panel';
import ColorsPanel from './colors-panel';

import {
  createGrid,
  setBrushSymbol,
  setBrushColor,
  changeBrush,
  paint
} from '../redux/main.actions';

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


const mapDispatchToProps = (dispatch) => ({

  changeSymbol: (symbol) => {
    console.log(symbol, this);
    dispatch(setBrushSymbol(symbol));
  },

  changeColor: (color, colorType) => {
    console.log(color, colorType);
    dispatch(setBrushColor(color, colorType));
  },

  changeBrushH: (brush) => {
    dispatch(changeBrush(brush));
  },

  paint: (xPos, yPos) => {
    dispatch(paint(xPos, yPos));
  }
})

const mapStateToProps = (state) => ({
  grid: state.main.grid,
  fColor: state.main.fColor,
  bgColor: state.main.bgColor,
  brushes: state.main.brushes,
  swatches: state.main.swatches
});

const mouseDownHandler = R.curry((maxWidth, maxHeight, paint, downEvent) => {

  let prevXPos = null;
  let prevYPos = null;

  const editor = downEvent.currentTarget;

  const mouseMoveHandler = (moveEvent) => {
    const l = cumulativeOffset(offsetLeft)(editor);
    const t = cumulativeOffset(offsetTop)(editor);
    const w = editor.offsetWidth;
    const h = editor.offsetHeight;
    const x = moveEvent.clientX;
    const y = moveEvent.clientY;

    const xPos = Math.floor((x - l) / w * maxWidth);
    const yPos = Math.floor((y - t) / h * maxHeight);

    if (prevXPos !== xPos || prevYPos !== yPos) {
      paint(xPos, yPos);

      prevXPos = xPos;
      prevYPos = yPos;
    }
};

  const mouseUpHandler = upEvent => {
    window.removeEventListener('mousemove', mouseMoveHandler);
  };

  window.addEventListener('mouseup', mouseUpHandler);
  window.addEventListener('mousemove', mouseMoveHandler);
});

const render = (props) => {

return <div className="ui">
  <div className="l-panel">
    <ColorsPanel
      fColor={ props.fColor }
      bgColor={ props.bgColor }
      changeFColorHandler={(event) => props.changeColor(event.target.value, 'fColor')}
      changeBGColorHandler={(event) => props.changeColor(event.target.value, 'bgColor')}
      />
    <BrushesPanel fColor={props.fColor} bgColor={props.bgColor} brushes={props.brushes} clickHandler={props.changeSymbol} />
  </div>
  <div className="c-panel">
    <Canvas mouseDownHandler={mouseDownHandler(props.grid[0].length, props.grid.length, props.paint)} grid={ props.grid }/>
  </div>
  <div className="r-panel">
    <SwatchesPanel swatches={props.swatches} clickHandler={props.changeBrushH}/>
  </div>
</div>};

export default connect(mapStateToProps, mapDispatchToProps)(render);
