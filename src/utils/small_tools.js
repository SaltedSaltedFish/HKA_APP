
//  排序
export const sort_team = (array) => {

	let nB = {};

	array.map( ind => {
		if ( !nB[ind.TEAMS] ) {
			nB[ind.TEAMS] = [];
		};

		if ( nB[ind.TEAMS] ) {
			nB[ind.TEAMS].push(ind);
		}
	});

	return nB;
};