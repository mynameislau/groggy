import {
  neighbours,
  neighbour,
  orientation,
  actualNeighCoords,
  flood,
  floodOld,
  insert
} from './cartesian-grid';
import assert from 'assert';

const sampleGrid = [
  ['a', 'b', 'c', 'd'],
  ['e', 'f', 'g', 'h'],
  ['i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p'],
  ['q', 'r', 's', 't']
];

const simpleSample = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i'],
];

describe('grid capabilities', () => {
  it('can get a list of neighbours', () => {
    assert.deepEqual(neighbours(1, 1, sampleGrid), ['b', 'g', 'j', 'e']);
  });

  it('should return null if some neighbour is out of the grid (like if your target is close to an edge', () => {
    assert.deepEqual(neighbours(0, 0, sampleGrid), [null, 'b', 'e', null]);
  });

  it('provide a function that retrieves only the coordinates of number inside the grid', () => {
    assert.deepEqual(
      actualNeighCoords(0, 0, sampleGrid[0].length, sampleGrid.length),
      [[1, 0], [0, 1]]
    );
  });

  it('should be able to return a specific neighbour or null if it does not exist', () => {
    assert.deepEqual(neighbour(1, 1, 'N', sampleGrid), 'b');
    assert.deepEqual(neighbour(1, 1, 'S', sampleGrid), 'j');
    assert.deepEqual(neighbour(0, 0, 'N', sampleGrid), null);
    assert.deepEqual(neighbour(0, 0, 'E', sampleGrid), 'b');
    assert.deepEqual(neighbour(2, 2, 'W', sampleGrid), 'j');
  });

  it('can deduce point location in space from another point', () => {
    assert.equal(orientation(1, 1, 1, 0), 'N');
    assert.equal(orientation(1, 1, 0, 1), 'W');
    assert.equal(orientation(1, 1, 2, 1), 'E');
    assert.equal(orientation(1, 1, 1, 2), 'S');
    assert.equal(orientation(0, 0, 1, 4), 'S');
  });

  it('can insert a value inside a two dimensional array', () => {
    assert.deepEqual(
      insert([2, 2], 'toto'),
      [ [], [], [ null, null, 'toto' ] ]
    )
  });

  it('can flood through a grid conditionnally with the use of a predicate', () => {
    assert.deepEqual(
      flood(val => val !== 'b', [0, 0], simpleSample),
      [ [ 'a', null , 'c' ], [ 'd', 'e', 'f' ], [ 'g', 'h', 'i' ] ]
    );
  })
});
