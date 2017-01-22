import R from 'ramda';

import * as actions from './main.actions';

const brushes = '▩≋◸≉"@ ./+-#&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

const trace = x => {
  console.log(x);

  return x;
};

const sameColorsAndSymbol = R.curry((a, b) =>
  a.symbol === b.symbol && a.fColor === b.fColor && a.bgColor === b.bgColor
);

const gridSwatches = R.compose(
  R.reduce((acc, val) =>
    R.find(sameColorsAndSymbol(val), acc) ?  acc : R.append(val, acc)
    , []),
  R.unnest
);

const initialState = {
  grid: [[]],
  gridW: 0,
  gridH: 0,
  symbol: '@',
  brushes: brushes,
  fColor: '#FF0000',
  bgColor: '#000000',
  swatches: [],
  tool: 'pen'
};

const applyToCell = ([x, y], fn) =>
  R.adjust(
    R.adjust(
        fn,
      x),
    y);

const setGraphicProps = state => R.compose(
  R.assoc('symbol', state.symbol),
  R.assoc('fColor', state.fColor),
  R.assoc('bgColor',state.bgColor)
);

const updateGrid = grid => R.compose(
  (state) => R.assoc('swatches', gridSwatches(state.grid), state),
  R.assoc('gridW', grid[0].length),
  R.assoc('gridH', grid.length),
  R.assoc('grid', grid)
);

export default (prevState = initialState, action) => {
  const payload = action.payload;

  switch (action.type) {

    case actions.CREATE_GRID:
      return updateGrid(action.payload)(prevState);

    case actions.CHANGE_TOOL:
      return R.assoc('tool', payload, prevState);

    case actions.CHANGE_BRUSH:
      return R.assoc('brush', payload, prevState);

    case actions.CHANGE_COLOR:
      console.log(payload.colorType, payload.color)
      return R.assoc(payload.colorType, payload.color, prevState);

    case actions.CHANGE_SYMBOL:
      return R.assoc('symbol', payload, prevState);

    case actions.PAINT:
      return R.compose(
        (state) => R.assoc('swatches', gridSwatches(state.grid), state),
        (state) => R.assoc('grid', R.reduce((grid, coords) =>
          applyToCell(coords, setGraphicProps(state))(grid)
          , state.grid
        , payload), state)
      )(prevState);

    default:
      return prevState;
  }
}
