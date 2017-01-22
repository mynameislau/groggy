import { Maybe } from 'ramda-fantasy';
import R from 'ramda';
const Just = Maybe.Just;
const Nothing = Maybe.Nothing;

const edge = R.curry((grid, y, x) =>
  (grid[y] && grid[y][x] ? grid[y][x] : null)
);

export const neighbours = R.curry((x, y, grid) => {
  const gEdge = edge(grid);
  return R.map(coords => gEdge(coords[1], coords[0]), neighboursCoordinates(x, y));
});

const neighbourIndex = direction => {
  switch (direction) {
    case 'N': return 0;
    case 'E': return 1;
    case 'S': return 2;
    case 'W': return 3;
  }
}

const neighboursCoordinates = (x, y) => [ [x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]];

export const actualNeighCoords = (x, y, gridW, gridH) => {
  const toReturn = [];
  if (y > 0) { toReturn.push([x, y - 1]); }
  if (x < gridW - 1) { toReturn.push([x + 1, y]); }
  if (y < gridH - 1) { toReturn.push([x, y + 1]); }
  if (x > 0) { toReturn.push([x - 1, y]); }

  return toReturn;
}

export const neighbour = R.curry((x, y, direction, grid) =>
  neighbours(x, y, grid)[neighbourIndex(direction)]);

const adjustGrid = (fn, x, y) =>
  R.adjust(R.adjust(fn, x), y);


//works but not optimized
const floodOld = (predicate, [x, y], grid, acc = []) => {
  const gEdge = edge(grid);
  const currEdge = gEdge(y, x);

  const canBeAdded = !R.isNil(currEdge) && predicate(currEdge) && !R.contains([x, y], acc);

  if (canBeAdded) {
    const currNeighboursCoords = neighboursCoordinates(x, y);
    return R.reduce(
      (mAcc, mCoords) =>  floodOld(predicate, mCoords, grid, mAcc),
      R.append([x, y], acc),
      currNeighboursCoords
    );
  }
  else {
    return acc;
  }
}

export const insert = ([x, y], val, grid = []) =>
  R.times(i => {
    if (i !== y) {
      if (!grid[i]) { return []; }
      else { return grid[i]; }
    }
    else {
      return R.times(n => {
        if (n !== x) {
          if (!grid[y] || !grid[y][n]) { return null; }
          else { return grid[y][n]; }
        }
        else {
          return val;
        }
      }, x + 1);
    }
  }, y + 1);

// somewhat optimized functional version but still max call stack problem
export const floodRecur = (predicate, [oX, oY], grid) => {
  const isInvalid = ([x, y], acc) => (acc[y] && acc[y][x]) || (!grid[y] || !grid[y][x]) || !predicate(grid[y][x]);

  const recur = ([x, y], acc = []) =>
    isInvalid([x, y], acc) ?
      acc
      : R.reduce(
          (currentAcc, currentCoords) => recur(currentCoords, currentAcc)
          , insert([x, y], grid[y][x], acc)
          , neighboursCoordinates(x, y)
        );

  return recur([oX, oY]);
}

// imperative programming version
export const flood = (predicate, [oX, oY], grid) => {
  const gridW = grid[0].length;
  const gridH = grid.length;

  const open = [];

  const acc = R.times(() => R.times(() => null, gridW), gridH);
  const visited = [].concat(acc);

  open.push([oX, oY]);

  while (open.length) {
    const [x, y] = open.pop();
    visited[y][x] = true;
    acc[y][x] = grid[y][x];

    actualNeighCoords(x, y, gridW, gridH).forEach(([currX, currY]) => {
      if (
        !visited[currY][currX]
        && predicate(grid[currY][currX])
      ) {
        open.push([currX, currY]);
      }
    });
  }

  return acc;
}

/******

         - PI / 2
PI                    0
          PI / 2

*******/

export const orientation = (x1, y1, x2, y2) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);

  console.log(x1, y1, x2, y2, 'angle :', angle);

  if (angle >= - Math.PI * 0.75 && angle < - Math.PI * 0.25) { return 'N'; }
  if (angle >= - Math.PI * 0.25 && angle < Math.PI * 0.25 ) { return 'E'; }
  if (angle >= Math.PI * 0.25 && angle < Math.PI * 0.75) { return 'S'; }
  if (angle >= Math.PI * 0.75 || angle < - Math.PI * 0.75) { return 'W'; }

  return null;
}
