export const CREATE_GRID = 'CREATE_GRID';
export const SET_BRUSH_SYMBOL = 'SET_BRUSH_SYMBOL';
export const SET_BRUSH_COLOR = 'SET_BRUSH_COLOR';
export const CHANGE_BRUSH = 'CHANGE_BRUSH';
export const PAINT = 'PAINT';

export const createGrid = (grid) => ({
  type: CREATE_GRID,
  payload: grid
});


export const setBrushSymbol = symbol => ({
  type: SET_BRUSH_SYMBOL,
  payload: symbol
})

export const setBrushColor = (color, colorType) => ({
  type: SET_BRUSH_COLOR,
  payload: {
    color: color,
    colorType: colorType
  }
});

export const changeBrush = brush => ({
  type: CHANGE_BRUSH,
  payload: brush
});

export const paint = (xPos, yPos) => ({
  type: PAINT,
  payload: {
    x: xPos,
    y: yPos
  }
});
