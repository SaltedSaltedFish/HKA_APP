import './index.less';

import React,{Component} from 'react';
import {Flex,ActivityIndicator } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Transition from '../../../components/Transition';
import { TimeYear } from '../../../components/TimeChoice';

import Api from '../../../api/request';
import getState from '../../../utils/getState';
import { saveHourStatistics } from '../../../actions/hourStatistics';

import {CALENDAR,CALENDARMONTH} from '../../../data';

const FlexItem = Flex.Item;

class ManHourStatistics extends Component {
    constructor(props){
        super(props);
        let date = new Date();
        let Calendar = {
            _Y_year: date.getFullYear(),
            _M_month: date.getMonth() + 1,
            _Y_lastYear: 0,
            _M_lastMonth: 0,
            _Y_nextYear: 0,
            _M_nextMonth: 0,
        };
	    let role = Boolean(Number(localStorage.identity))?'1':'0';

	    if ( !this.props.reduxState.array ) {
		    this.defaultMonth(date);
        };

        this.dateMonth = date.getMonth() + 1;
        this.dateDay = date.getDate();


        /*
        * @param {obj} hourList 月度工时统计
        * @param {obj} detailed 每天的工作清单
        * @param {Array} array 日历规格
        * @param {String} role 角色身份
        * @param {String} day 清单具体日期
        * */
        this.state = {
            iObj:{},
            d:0,
            Calendar,
            array:[],
            selected:null,
            monthNow:date.getMonth() + 1,
            monthSelected:null,
            day:'',

            hourList:{},    //  后台获取
            detailed:{},    //  清单

            showScreen:null,

            inProp:false,

			checked:true,
            role,

	        CalendarLoading:true,
	        NowYear:date.getFullYear()
        };

        this.timer = null;
    };

    componentDidMount = _ => {

    };

    componentWillMount(){
        if ( this.props.reduxState.array ) {
            this.setState({
              ...this.props.reduxState
            });
            return;
        };

        this.update();
        this.getTotalHours();
    };

	componentWillUnmount(){
		clearInterval(this.timer);
		this.props.dispatch(saveHourStatistics({...this.state}));
		this.setState = () => {};
	};

    defaultMonth = _ => {
        CALENDARMONTH.map(s=>s.map(n=>{
            if(n.month == _.getMonth() + 1 ) {
                n.selected = true;
            }
        }))
    };

    update(){
        let { Calendar ,iObj ,d,role} = this.state;
        d = (new Date(Calendar._Y_year,Calendar._M_month -1,1)).getDay();
        iObj.thisMonthDay = this.dayLen(Calendar._M_month);
        this.listArray(this.getRows(iObj,d),iObj,d,Calendar);
        let condition = {
	        completiondate:Calendar._Y_year + '-' + (Calendar._M_month < 9? '0'+Calendar._M_month:Calendar._M_month),
	        role
        };
        Api.post('workorder/getEngineerMonthList',condition)
            .then(res => {
                if (res.errorCode == 0) {
					this.timer = setInterval(()=>{
						let ResArray = res.data.timeList;
						//let objKey = Object.keys(array);
						let hourList = {};
						//console.log(array);

						ResArray.map( s => {
							hourList[s.ACCOMPLISHDATE] = s
                        });

						this.setState({
							hourList,
							selected:null,
							CalendarLoading:false
                        });
						//console.log(hourList);
						clearInterval(this.timer);
                    },MS)
                }
            })
    };

    getTotalHours = _ => {
	    let { Calendar,role,day } = this.state;
        //  默认天
        if (!_) {
            _ = {};
            _.day = new Date().getDate();
        };

	    _.day = String(_.day).length < 2?_.day <= 9? '0' + _.day:_.day:_.day;

        let condition = {
            completiondate:Calendar._Y_year
            + '-' +
            (Calendar._M_month <= 9? '0'+Calendar._M_month:Calendar._M_month)
            +'-'+ _.day,
            username:localStorage.userAccount,
	        role
        };
        //console.log(condition);
        day = _.day;
        Api.post('workorder/getEngineerWorkTimeList',condition)
            .then(res => {
                //console.log(res);
                if (res.errorCode == 0) {
                    this.setState({
                        detailed:res.data,
	                    day
                    });
                }
            })
    };

    //  判断闰年
    isLeap() {
        const { Calendar } = this.state;
        let _year = Calendar._Y_year;
        if(_year % 4 === 0 && _year % 100 > 0) {
            return true ;
        };

        if(_year % 400 === 0 && _year % 3200 > 0) {
            return true ;
        }
        return false ;
    }

    //  获取月的天数
    dayLen(_month) {
        if(_month === 2) {
            if(!this.isLeap()) return 28;
            return 29;
        }
        if(_month < 8 && _month % 2 === 1) {
            return 31;
        }
        if(_month >= 8 && _month % 2 === 0) {
            return 31;
        }
        return 30 ;
    }

    getRows(iObj,d){
        let totalDay = d + iObj.thisMonthDay;
        return Math.ceil(totalDay/7);
    }

    //  二维数组
    listArray = (rows,iObj,d,Calendar) => {
        /*
        * @param { obj } Calendar 日期对象
        * @param { Boolean } selected 是否选中
        * @param { Boolean } weekend 是否为周末
        * */

        let fill = 0,
            nextMonthfill = 0,
            start = 0,
            thisMonthDay = iObj.thisMonthDay,
            array = [],
	        dateParam = Calendar._Y_year + '-' + (Calendar._M_month <= 9?'0'+ Calendar._M_month:Calendar._M_month);
        for(let i = 0; i < rows; i++) {
            array[i] = [];
            for(let j = 0; j < 7; j++) {
                start++;
                fill = start - d;
                if(fill > 0 && fill <= thisMonthDay) {
	                if (Calendar._M_month == this.dateMonth && this.dateDay == fill) {
		                this.state.selected = [i,j];
		                array[i][j] = {
			                day:fill,
			                selected:true,
			                dateParam
		                };
	                } else {
		                array[i][j] = {
			                day:fill,
			                dateParam,
			                selected:false,
		                }
	                }
                }else if(fill <= 0) {
                    //array[i][j] =  this.dayLen(Calendar._M_lastMonth) + fill;
                    array[i][j] = "";
                }else if(fill > thisMonthDay) {
                    //array[i][j] = ++nextMonthfill;
                    array[i][j] = "";
                }
            }
        };
        this.setState({
            array
        });
        //return array;
    };

    //  选中
    onClick = (e,v,n) => {
    	//console.log(v,n);
        e.preventDefault();

        let { array , selected} = this.state;
        //console.log(selected,array);

        selected?array[selected[0]][selected[1]].selected = false:null;
        array[v][n].selected = true;
        selected = [v,n];

        this.setState({array,selected,detailed:{}},this.getTotalHours(array[v][n]));
    };

    //  默认情况需要优化
    onChange = obj => {
        let { Calendar,monthSelected,monthNow } = this.state;
        if (monthSelected) {
            if (obj.month == monthSelected.month) {
                return;
            }
            monthSelected.selected = false;
        } else {
            CALENDARMONTH.map(s=>s.map(n=>{
                if(n.month == monthNow ) {
                    n.selected = false;
                }
            }))
        }
        obj.selected = true;
        monthSelected = obj;
        Calendar._M_month = obj.month;
        this.setState({
            monthSelected,
            detailed:{tasklist:[]},
	        CalendarLoading:true
        },this.update());
    };

    toggle = _ => {
        this.setState({
            inProp:!this.state.inProp
        });
    };

    RefreshList = _ => {
	    this.setState({detailed:{}},this.getTotalHours({day:this.state.day}));
    };

    toggleTime = () => {
		this.setState({checked:!this.state.checked});
    };

	updateTime = (obj) => {
	    //console.log(obj);
		let { Calendar } = this.state;

		Calendar._Y_year = obj.nowDate;
		this.setState({
			detailed:{tasklist:[]},
			CalendarLoading:true
		},this.update());
    };

    render(){
        let {
            array,Calendar,monthNow,showScreen,
            hourList,detailed,inProp,checked,
            CalendarLoading,NowYear
        } = this.state;
        let month = Calendar._M_month;
        let monthName = getState.monthName(month);
        let year = Calendar._Y_year;
        let day = 0;
        let workDate = false;
        // d = (new Date(Calendar._Y_year,Calendar._M_month-1,1)).getDay();
        // iObj.thisMonthDay = this.dayLen(Calendar._M_month);
        // let array = this.listArray(this.getRows(iObj,d),iObj,d);
        return (
            <Content
                style={{paddingBottom:0}}
            >

				<Header>
					<div className="icon icon-calendar" onClick={this.toggle} >

					</div>
					<TimeYear month={monthName} fn={this.updateTime}/>
                    <div
                        onClick={this.toggleTime}
                        className={`icon hour-switch ${checked?'active':''}`}>
                        <span></span>
                    </div>
				</Header>
                <div className={`calendarContainer ${checked?'active':''} loadingBox`}>
                    <ActivityIndicator
                        toast
                        text="Loading..."
                        animating={ CalendarLoading }
                    />
                    <Flex className="title">
                        {
                            CALENDAR.map((s,v)=>
                                <FlexItem key={v}>
                                    {s}
                                </FlexItem>
                            )
                        }
                    </Flex>
                    {
                        array.map((s,v)=>
                            <Flex key={v}>
                                {
                                    s.map((m,n)=>{
                                    	day = String(m.day).length < 2? m.day <= 9?'0' + m.day:m.day:m.day;
	                                    workDate = hourList[m.dateParam +'-'+ day];
                                    	return (
		                                    <FlexItem
			                                    key={n}
			                                    onClick = {!workDate?null:_=>this.onClick(_,v,n)}
			                                    className={m.day?"calendarList":""}
		                                    >
			                                    <div
				                                    className={`${m.selected}`}
			                                    >
				                                    <div className={`date ${!workDate && m.day?'rest':''}`}>{day}</div>
				                                    <div
					                                    className={`time ${!workDate && m.day?'weekend':''}`}

				                                    >
					                                    {
						                                    workDate && m.day?
							                                    <div>
                                                                <span className={`actual`}>
                                                                    {
	                                                                    workDate.ACTUALMHSUM
                                                                    }
                                                                </span>
								                                    <span className={`plan`}>
                                                                    {
	                                                                    workDate.MANHOUSSUM
                                                                    }
                                                                </span>
							                                    </div>:null
					                                    }
				                                    </div>
			                                    </div>
		                                    </FlexItem>
	                                    )
                                    })
                                }
                            </Flex>
                        )
                    }
                </div>

                {
	                checked?
                        <div className="exp">
                            <div className="exp-content">
                                <ul>
                                    <li>Actual time</li>
                                    <li>Schedule time</li>
                                </ul>
                            </div>
                        </div>:null
                }

                <div className="detailedList">
                    <div className="title">
                        {/*<h1>{monthName.name} {detailed.countmh?detailed.countmh:'0'}th</h1>*/}
	                    <h1>{monthName.name}</h1>
                        <span className="icon icon-hourUpdate" onClick={this.RefreshList}></span>
                    </div>

                    <div className="listContainer">
                        {
	                        detailed.tasklist?
                            detailed.tasklist.length > 0?detailed.tasklist.map((s,v)=>
                                <div key={v} className="list">
                                    <Link
                                        to={{
                                            pathname:'/work_details',
                                            search:'?id='+s.assignworkid
                                        }}
                                    >
                                        <span className="time"></span>
                                        <div className="listContent">
		                                    {s.taskno}
                                            <span className="hour">MH:{s.manhous}</span>
                                        </div>
                                    </Link>
                                </div>
                            ):<div className="noData">No Data</div>:<ActivityIndicator />
                        }
                    </div>
                </div>

                {
					inProp?
						<Transition>
							<div className="mark" onClick={this.toggle}></div>
							<div
								//className={`ScreeningMonth ${showScreen?'show':'hidden'}`}
								className='ScreeningMonth'
							>
								<div className="ScreeningContainer">
									{
										CALENDARMONTH.map((s,v)=>
											<Flex key={v}>
												{
													s.map((m,n)=>
														<FlexItem
															key={n}
															className={
																(monthNow < m.month && Calendar._Y_year == NowYear?'prohibit':'')
																+ '' +
																(m.selected?'selected':'')
															}
															onClick={()=>this.onChange(m)}
														>
															{m.name}
														</FlexItem>
													)
												}
											</Flex>
										)
									}
								</div>
							</div>
						</Transition>:null
                }

            </Content>
        )
    }
}

ManHourStatistics = connect(state => ({
	reduxState:state.HourStatisticsData
}))(ManHourStatistics);
export default ManHourStatistics;