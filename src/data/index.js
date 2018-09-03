/**
 * Created by admin on 2017/08/28.
 */
export const index = [
    {
        state:'A',
        date:'2017-01-01',
        list:[
            {
                title:'Wonnum',
                info:'WOLM17893'
            },{
                title:'测试使用',
                info:'wolm17893'
            }
        ]
    },{
        state:'B',
        date:'2017-01-01',
        list:[
            {
                title:'Wonnum',
                info:'WOLM17893'
            },{
                title:'测试使用',
                info:'wolm17893'
            }
        ]
    },{
        state:'B',
        date:'2017-01-01',
        list:[
            {
                title:'Wonnum',
                info:'WOLM17893'
            },{
                title:'测试使用',
                info:'wolm17893'
            }
        ]
    },{
        state:'A',
        date:'2017-01-01',
        list:[
            {
                title:'Wonnum',
                info:'WOLM17893'
            },{
                title:'测试使用',
                info:'wolm17893'
            }
        ]
    }
];

export const workList = [
    {
        state:'going',
        lv:'A',
        title:'WOLM17899',
        speed:'Assigned to: GROUPC 4',
        info:[
            {
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            }
        ]
    },
    {
        state:'going',
        lv:'A',
        title:'WOLM17897',
        speed:'Assigned to: GROUPC 6',
        info:[
            {
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            }
        ]
    },
    {
        state:'delayed',
        lv:'C',
        title:'WOLM17895',
        speed:'Assigned to: GROUPC 9',
        info:[
            {
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            }
        ]
    },
    {
        state:'handover',
        lv:'B',
        title:'WOLM17892',
        speed:'Assigned to: GROUPC 10',
        info:[
            {
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            },{
                title:'Tasknum',
                pn:'ZL-411-01-03'
            }
        ]
    },
];


export const FlightListData = [
    {
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    },{
        "FLT_NO":'9CC8813',
        "AC_TYPE":'A330',
        "TIME":'7:00am',
        "GATE":'B5',
        "STATUS":'On time'
    }
];


export const manualTECHNIC = [
    {
        name:'ADD',
        path:'/addList'
    },
    // {
    //     name:'DAMAGE',
    //     path:'/damList'
    // }
];

export const manualAC_CONFIG = [
    {
        name:'SB',
        path:'sbList'
    },{
        name:'MOD',
        path:'modList'
    },{
        name:'FLS',
        path:'flsList'
    }
];

export const manualHDBK = [
    {
        name:'AMM',
        path:'ammList'
    },{
        name:'IPC',
        path:'/ipcManual'
    },{
        name:'TSM',
        path:'/tsmList'
    },{
		name:'SRM',
		path:'/srm_list'
	}
];

export const manual_OHTER = [
	{
		name:'NRC',
		path:'/nrc'
	},
	// {
	// 	name:'PARTS',
	// 	path:'/parts'
	// },
	{
		name:'OI',
		path:'/oi'
	}, {
		name:'TA',
		path:'/ta_list'
    }, {
		name:'TB',
		path:'/tbList'
	},
	// {
	// 	name:'MEL',
	// 	path:'/melOne'
	// },
    {
        name:'MAINTENANCE',
        path:'/maintenance'
    }
];

/*日历*/
export const CALENDAR =[
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];

export const CALENDARMONTH = [
    [
        {name:'JAN',month:1},
        {name:'FEB',month:2},
        {name:'MAR',month:3},
        {name:'APR',month:4}
    ],[
        {name:'MAY',month:5},
        {name:'JUN',month:6},
        {name:'JUL',month:7},
        {name:'AUG',month:8}
    ],[
        {name:'SEP',month:9},
        {name:'OCT',month:10},
        {name:'NOV',month:11},
        {name:'DEC',month:12}
    ]
];

export const ACTYPE = [
	{value:'A320',label:'A320'},
	{value:'A330',label:'A330'},
	{value:'A350',label:'A350'}
];

export const TaskState = [
	{value:'',label:'ALL'}, //  全部
    {value:'0',label:'Non Feedback'},   //  未反馈
	//{value:'1',label:'Feedback'}, //  反馈的
	{value:'2',label:'No Done'},    // 反馈为未完成的
	{value:'3',label:'Endw'}    //  反馈为完成的
];