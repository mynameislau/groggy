import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import R from 'ramda';
import { IO } from 'ramda-fantasy';

import UI from './components/ui';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import mainReducer from './redux/main.reducer';

const store = createStore(combineReducers({
  main: mainReducer
}));

let mainState = mainReducer(undefined, {});
store.subscribe(state => {
  mainState = store.getState().main;
});

export default () => mainState ?
<Provider store={store}>
  <UI />
</Provider>
: null;
