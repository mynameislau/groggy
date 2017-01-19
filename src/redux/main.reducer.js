import R from 'ramda';
import {
  CREATE_GRID,
  SET_BRUSH_SYMBOL,
  SET_BRUSH_COLOR,
  CHANGE_BRUSH,
  PAINT,

  createGrid,
  setBrushSymbol,
  setBrushColor,
  changeBrush,
  paint
} from './main.actions';

const brushes = '▩≋◸≉"@ ./+-#&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

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


const sameColorsAndSymbol = R.curry((a, b) =>
  a.symbol === b.symbol && a.fcolor === b.fcolor && a.bgcolor === b.bgcolor
);

const gridSwatches = R.compose(
  R.reduce((acc, val) =>
    R.find(sameColorsAndSymbol(val), acc) ?  acc : R.append(val, acc)
    , []),
  R.unnest
);

const initialState = {
  grid: rogueMap,
  symbol: '@',
  brushes: brushes,
  fColor: '#FF0000',
  bgColor: '#000000',
  swatches: []
};

const applyToCell = (x, y, fn) =>
  R.adjust(
    R.adjust(
        fn,
      x),
    y);

const setGraphicProps = state => R.compose(
  R.assoc('symbol', state.symbol),
  R.assoc('fcolor', state.fColor),
  R.assoc('bgcolor',state.bgColor)
);

export default (prevState = initialState, action) => {
  const payload = action.payload;

  switch (action.type) {

    case CREATE_GRID:
      return prevState;

    case CHANGE_BRUSH:
      return R.assoc('brush', payload, prevState);

    case SET_BRUSH_COLOR:
      return R.assoc(payload.colorType, payload.color, prevState);

    case SET_BRUSH_SYMBOL:
      return R.assoc('symbol', payload, prevState);

    case PAINT:
      return R.compose(
        (state) => R.assoc('swatches', gridSwatches(state.grid), state),
        (state) => R.assoc('grid', applyToCell(payload.x, payload.y, setGraphicProps(state))(state.grid), state)
      )(prevState);

    default:
      return prevState;
  }
}
