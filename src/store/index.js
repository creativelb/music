import {createStore, combineReducers, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk';

import {playerReducer} from './player/reducer.js'
import {appReducer} from './app/reducer'

let store = createStore(
    combineReducers({playerReducer, appReducer}),
    composeWithDevTools(applyMiddleware(thunk))
);

export default store;