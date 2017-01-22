import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import R from 'ramda';

import Canvas from './canvas';
import SwatchesPanel from './swatches-panel';
import BrushesPanel from './brushes-panel';
import ColorsPanel from './colors-panel';
import ToolsPanel from './tools-panel';
import FunctionsPanel from './functions-panel';
import Modal from './modal';

import * as actionsCreators from '../redux/main.action-creators';

import { flood } from '../graph/cartesian-grid';

import { exportDngnMap, defaultMap } from '../redux/main.utils';

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

const getMousePosition = (mouseEvent, element, maxW, maxH) => {
  const l = cumulativeOffset(offsetLeft)(element);
  const t = cumulativeOffset(offsetTop)(element);
  const w = element.offsetWidth;
  const h = element.offsetHeight;
  const x = mouseEvent.clientX;
  const y = mouseEvent.clientY;

  const xPos = Math.floor((x - l) / w * maxW);
  const yPos = Math.floor((y - t) / h * maxH);

  return [xPos, yPos];
}

// const bla = R.times(() => R.times(() => 'u', 32), 32);
// const A = window.performance.now();
// const floody = flood(() => true, [10, 10], bla);
// const B = window.performance.now();
// console.log('done', B - A, floody);

const render = ({ modal, symbol, tool, grid, gridW, gridH, fColor, bgColor, symbols, swatches, actions}) => {

  const bucketHandler = clickEvent => {
    const pos = getMousePosition(clickEvent, clickEvent.currentTarget, gridW, gridH);
    const [x, y] = pos;
    const flooded = flood(cell => cell.symbol === grid[y][x].symbol, pos, grid);
    console.log(flooded);
    const toCoordsArray = R.compose(
      R.filter(val => !R.isNil(val)),
      R.unnest,
      R.last,
      R.mapAccum(
      (yAcc, tab) => [
        yAcc + 1,
        R.compose(
          R.last,
          R.mapAccum((xAcc, val) => [
            xAcc + 1,
            val ? [xAcc, yAcc] : null
          ], 0)
        )(tab)
      ], 0)
    );

    actions.paint(toCoordsArray(flooded));
  }

  const mouseDownHandler = downEvent => {

    let prevXPos = null;
    let prevYPos = null;

    const editor = downEvent.currentTarget;

    const mouseMoveHandler = (moveEvent) => {
      const [xPos, yPos] = getMousePosition(moveEvent, editor, gridW, gridH);

      if (prevXPos !== xPos || prevYPos !== yPos) {
        actions.paint([
          [xPos, yPos]
        ]);

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

  return <div className="ui">
    <Modal message={modal} />
    <div className="l-panel">
      <ColorsPanel
      fColor={fColor}
      bgColor={bgColor}
      changeFColorHandler={(event) => actions.changeColor(event.target.value, 'fColor')}
      changeBGColorHandler={(event) => actions.changeColor(event.target.value, 'bgColor')}
      />
    <BrushesPanel fColor={fColor} bgColor={bgColor} symbol={symbol} symbols={symbols} clickHandler={actions.changeSymbol} />
    </div>
    <div className="c-panel">
      <div className="t-panel">
        <FunctionsPanel
        exportHandler={() => actions.setModal(exportDngnMap(grid))}
        stashHandler={() => localStorage.setItem('dngnmap', exportDngnMap(grid))}
        clearHandler={() => actions.createGrid(defaultMap)}
        />
        <ToolsPanel currentTool={tool} toolSelectHandler={actions.changeTool}/>
      </div>
      <div className="m-panel">
        <Canvas mouseDownHandler={tool === 'pen' ? mouseDownHandler : bucketHandler} grid={grid}/>
      </div>
      <div className="b-panel">
      </div>
    </div>
    <div className="r-panel">
      <SwatchesPanel swatches={swatches} clickHandler={actions.changeBrush}/>
    </div>
  </div>
};


const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actionsCreators, dispatch) });
const mapStateToProps = state => state.main;
export default connect(mapStateToProps, mapDispatchToProps)(render);
