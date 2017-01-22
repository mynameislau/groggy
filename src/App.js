import React from 'react';
import './App.css';

import UI from './components/ui';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import mainReducer from './redux/main.reducer';
import { defaultMap, importDngnMap } from './redux/main.utils';
import { createGrid } from './redux/main.action-creators';

const store = createStore(combineReducers({
  main: mainReducer
}));

const localMap = localStorage.getItem('dngnmap');
if (localMap) {
  store.dispatch(createGrid(importDngnMap(localMap)));
}
else {
  store.dispatch(createGrid(defaultMap));
}

export default () =>
  <Provider store={store}>
    <UI />
  </Provider>;
