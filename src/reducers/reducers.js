/*** Created by admin on 2017/7/6.*/

import {INDEX} from '../actions/index';
import {RESET} from '../actions/reset';
import {SCHEDULE,HISTORY} from '../actions/arriveals';
import {ADMINWORKLIST,ADMINWORKRELATION,ADMINWORKPENDING,EMPWORKLIST,ALARM} from '../actions/workOrder';
import {MANUALAMM,
	MANUALADD,MANUALTB,
	MANUALNRC,MANUALOI,MANUALIPC,
	MANUALSB,MANUALMOD,MANUALFLS,
	MANUALDAM,MANUALTA,MAINTENANCE,MANUALTSM,MANUALSRM
} from '../actions/manual';

import { actionsHourStatistics } from '../actions/hourStatistics';


//	首页
export const HomePageList = (state = {},action) => {
	//console.log(action.type);
	switch (action.type) {
		case INDEX:
			return action.state;
		case RESET:
			return {};
		default:
			return state;
	}
};
//
export const AdminWorksheetList = (state = {},action) => {
    //console.log(action.type);
    switch (action.type) {
        case ADMINWORKLIST:
            return {assigned:action.state};
		case ADMINWORKRELATION:
			return {relation:action.state};
		case ADMINWORKPENDING:
			return {pending:action.state};
	    case ALARM:
		    return {alarm:action.state};
		case RESET:
			return {};
        default:
            return state;
    }
};
export const EmployeeWorksheetList = (state = {},action) => {
	//console.log(action.type);
	switch (action.type) {
		case EMPWORKLIST:
			return action;
		case RESET:
			return {};
		default:
			return state;
	}
};



export const ArrivalsState = (state = {},action) => {
    //console.log(action);
    switch (action.type) {
        case SCHEDULE :
            return {schedule:action.state,flightdate:action.state.condition.flightdate};
        case HISTORY :
            return {history:action.state,flightdate:action.state.condition.flightdate};
		case RESET:
			return {};
        default:
            return state;
    }
};


export const ManualAMM = (state = {},action ) => {
    switch (action.type) {
        case MANUALAMM :
            return {amm:action.state};
        case MANUALADD :
            return {add:action.state};
		case RESET:
			return {};
		case MANUALTB:
			return{tb:action.state};
		case MANUALNRC:
			return {nrc:action.state};
		case MANUALOI:
			return {oi:action.state};
		case MANUALIPC:
			return {ipc:action.state};
		case MANUALSB:
			return {sb:action.state};
		case MANUALMOD:
			return {mod:action.state};
		case MANUALFLS:
			return {fls:action.state};
		case MANUALDAM:
			return {dam:action.state};
		case MANUALTA:
			return {ta:action.state};
	    case MAINTENANCE:
		    return {main:action.state};
		case MANUALTSM:
			return {tsm:action.state};
	    case MANUALSRM:
		    return {srm:action.state};
        default:
            return state;
    }
};

//  工时统计
export const HourStatisticsData = (state = {}, action) => {
	switch (action.type) {
		case actionsHourStatistics:
			return {
				...action.state
			};
		case RESET:
			return {};
		default:
			return state
	}
};

//  路由切换动画
export const global = (state = {animateCls: 'left'}, action) => {
	switch (action.type) {
		case "CURRENT_ANIMATE":
			return {
				...state,
				animateCls: action.cls
			};
		default:
			return state
	}
};

