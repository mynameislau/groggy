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
    () => ({ symbol: ' ', fColor: '#FF0000', bgColor: '#000000' })
    , exampleW)
    , exampleH));

export const importDngnMap = R.compose(
  setCoords,
  R.map(
    R.map(val => ({ bgColor: val.b, fColor: val.f, symbol: val.s }))
  ),
  JSON.parse
)

export const exportDngnMap = R.compose(
  JSON.stringify,
  R.map(
    R.map(val => ({ b: val.bgColor, f: val.fColor, s: val.symbol }))
  )
);
