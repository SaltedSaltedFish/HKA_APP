/**
 * Created by Thinkpad on 2017/6/23.
 */
import { createStore,applyMiddleware,combineReducers } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

// if (
// 	localStorage.state &&
// 	localStorage.state != 'null' &&
// 	localStorage.state != undefined &&
// 	localStorage.state != '{}'
// ) {
// 	local_state = JSON.parse(localStorage.state);
// } else {
// 	local_state = reducers;
// };

const loadState = () => {
  try { // 也可以容错一下不支持localStorage的情况下，用其他本地存储
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    } else {
      return JSON.parse(serializedState);
    }
  } catch (err) {
    // ... 错误处理
    return undefined;
  }
}

//console.log({...reducers});

const middleware = [ thunk ];
let store = createStore(
    combineReducers({...reducers}),
    //loadState(),
    applyMiddleware(...middleware)
);
//store.subscribe(()=>console.log(store.getState()));
//const store_local = store.getState();
//console.log(store_local);

export default store;

window.onbeforeunload = (e) => {
  //const state = store.getState();
  //console.log(state);
  //localStorage.state = JSON.stringify(state);
};