import R from 'ramda';

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

export const defaultMap = setCoords(R.times(
  () => R.times(
    () => ({ symbol: ' ', fColor: 'red', bgColor: 'black' })
    , exampleW)
    , exampleH));
