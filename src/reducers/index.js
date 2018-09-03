/**
 * Created by admin on 2017/7/6.
 */
import {combineReducers} from 'redux';
import * as reducer from './reducers';
import * as purVip from './purVip';
import * as smsStore from './sms';

// const reducers = combineReducers({
// 	...reducer,
// 	...purVip
// });
//console.log(reducer,purVip);
const reducers = {
	...reducer,
	...purVip,
	...smsStore
};

export default reducers;