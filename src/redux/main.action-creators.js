import * as actions from './main.actions';

export const createGrid = (grid) => ({
  type: actions.CREATE_GRID,
  payload: grid
});

export const changeSymbol = symbol => ({
  type: actions.CHANGE_SYMBOL,
  payload: symbol
})

export const changeColor = (color, colorType) => ({
  type: actions.CHANGE_COLOR,
  payload: {
    color: color,
    colorType: colorType
  }
});

export const changeBrush = brush => ({
  type: actions.CHANGE_BRUSH,
  payload: brush
});

export const changeTool = tool => ({
  type: actions.CHANGE_TOOL,
  payload: tool
});

export const paint = (xyTuples) => ({
  type: actions.PAINT,
  payload: xyTuples
});
