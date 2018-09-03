
export const PurVip = (state = {}, action) => {
	switch (action.type) {
		case 'name':
			return {
				...action.state
			};
		default:
			return state
	}
};