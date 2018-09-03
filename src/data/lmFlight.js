// export const list = [
// 	{
// 		name:'A/C',
// 		field:'acreg',
// 		type:'a/c',
// 		icon:'tri'
// 	},{
// 		name:'FLT#',
// 		field:'fltid',
// 		type:'fltid',
// 	},{
// 		name:'STATION',
// 		field:'depstn',
// 		type:'staion0',
// 	},{
// 		name:'ETA',
// 		field:'etaFomat',
// 		type:'eta',
// 	},{
// 		name:'ATA',
// 		field:'ataFomat',
// 		type:'ata',
// 	},{
// 		name:'ARR/TOW BAY',
// 		field:'arr',
// 		type:'arr/towbay',
// 	},{
// 		name:'STATION',
// 		field:'arrstn',
// 		type:'station1',
// 	},{
// 		name:'ETD',
// 		field:'etdFomat',
// 		type:'etd',
// 	},{
// 		name:'ATD',
// 		field:'atdFomat',
// 		type:'atd',
// 	},{
// 		name:'DEP BAY',
// 		field:'',
// 		type:'depbay',
// 	},{
// 		name:'EIC',
// 		field:'',
// 		type:'eic',
// 	},{
// 		name:'MECH',
// 		field:'',
// 		type:'mech',
// 	},{
// 		name:'REMARK',
// 		field:'workNum',
// 		type:'remark',
// 	}
// ];

export const list = [
	{
		name:'A/C',
		field:'acreg',
		type:'a/c',
		//icon:'tri'
	},{
		name:'FLT No.',
		field:'fltid',
		type:'fltid',
	}
	// ,{
	// 	name:'Inbound',
	// 	field:'',
	// 	type:'Inbound'
	// }
	,{
		name:'ETA',
		field:'etaFomat',
		type:'eta',
	},{
		name:'ATA',
		field:'ataFomat',
		type:'ata',
	},{
		name:'FLT No.2',
		field:'fltid',
		type:'next-flt',
		next:true,
	},{
		name:'ETD',
		field:'etdFomat',
		type:'etd',
		next:true,
	},{
		name:'ATD',
		field:'atdFomat',
		type:'atd',
		next:true,
	}
];
/*
*   A/C飛機號
*	Flt. no 航班號
*	ETA 預計到港時間
*	ATA 實際到港時間
*	Inbound 到港
*	ARR/TOW BAY 到港機位，拖機機位
*	ETD 預計離港時間
*	ATD 實際離港時間
*	Outbound 出港
*	DEP BAY 離港機位
*	EIC 放行工程師
*	MECH 技工
* */