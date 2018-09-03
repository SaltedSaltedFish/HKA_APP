
import * as obj from '../actions/sms';

import { RESET } from '../actions/reset';

export const smsStore = (state = {}, action) => {
	//console.log(action);
	switch (action.type) {
		case obj.IorC:
			return {
				...action.state
			};
		case obj.HazC:
			return {
				...action.state
			};
		case obj.MyC:
			return {
				...action.state
			};
		case RESET:
			return {

			};
		default:
			return state
	}
};