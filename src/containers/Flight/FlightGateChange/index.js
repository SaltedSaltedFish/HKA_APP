import '../FlightList/index.css';
import './index.less';

import React,{Component} from 'react';
import {ListView,Flex,DatePicker} from 'antd-mobile';
import Api from '../../../api/request';
import { Link } from 'react-router-dom';
import moment from 'moment';

import TimeConversion from '../../../utils/TimeConversion';
import ListViewComponent from '../../../components/ListView';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

/**/
import LMFlightList from '../../../components/LM/FlightList';
/**/

import { list } from '../../../data/lmFlight';

const FlexItem = Flex.Item;
const url = 'acflight/gate/list ';
//const url = 'acflight/flight/list';

/*使用其他的标签作为时间的children*/
const DatePickerChildren = props => (
    <div
        onClick={props.onClick}
        className="datePicker-date"
    >
        {props.extra}
    </div>
);

//  一天的毫秒
const dayMs = 24*60*60*1000;
let nowDate = TimeConversion.date();
let array = [];
const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});
//  默认值

class FlightGateChange extends Component {
    constructor(props){
        super(props);

	    let zhNow = moment(props.location.search.replace('?','') || nowDate).locale('zh-cn').utcOffset(8);
	    let condition = {flightdate:props.location.search.replace('?','')};

        this.state = {
            dpValue:zhNow,
            nowDate:nowDate,

            dataSource:false,
            refreshing:false,
            isLoading:true,
            pageNow:2,
            hasMore:false,
            totalPageSize:0,
            rollingState:false,

	        condition,
	        width:'100%' //  ul宽
        };
    }

    componentWillMount(){
        //console.log(this.props);
        this.update();
    }

    componentDidMount(){
	    console.log(this.refs);
	    let width = 0;
	    Object.keys(this.refs).map( s =>
		    {
			    //console.log(this.refs[s],this.refs[s].offsetWidth,this.refs[s].clientWidth,this.refs[s].scrollWidth);
			    width += (this.refs[s].offsetWidth + 1);
		    }
	    );

	    //console.log(width);

	    width += 'px';

	    this.setState({
		    width
	    })
    };

    update = _ => {

        //console.log(_);
        //this.state.flightDate = condition.flightdate;
        const { condition } = this.state;
        let set;
        set = setTimeout(_=>{
            this.setState({
                dataSource:false
            });
        },100);

	    condition.pageNow = 1;

        return Api.post(url,condition)
            .then(res => {
                clearTimeout(set);
                if(res.errorCode == 0) {
                    let data = res.pageInfo.pageData;
                    array = data;
                    this.setState({
                        dataSource:dataSource.cloneWithRows(data),
                        totalPageSize:res.pageInfo.totalPageSize,
                        hasMore:false,
                        pageNow:2
                    })
                }
            })
    };


    handleTabClick = _ => {
        //console.log('onTabClick', _);
    };

    callback = _ => {
        //console.log(_);
    };

    //  时间变化
    dateChange = _ => {
        const date = _._d;
        let nowDate = TimeConversion.TIME(date);
        condition.flightdate = nowDate;
        this.update();
        this.setState({ dpValue: _ ,nowDate:nowDate,condition});
    };

    //  增加
    increase = _ => {
        let dateDefault = this.state.dpValue;
        let date = dateDefault._d;
        let nowDate;
        date = date.getTime() + dayMs;
        //console.log(new Date(date));
        dateDefault._d = new Date(date);
        nowDate = TimeConversion.TIME(new Date(date));
        condition.flightdate = nowDate;
        this.update();
        this.setState({ dpValue: dateDefault ,nowDate:nowDate,condition});
    };
    //  减少
    reduce = _ => {
        let dateDefault = this.state.dpValue;
        let date = dateDefault._d;
        let nowDate;
        date = date.getTime() - dayMs;
        //console.log(new Date(date));
        dateDefault._d = new Date(date);
        nowDate = TimeConversion.TIME(new Date(date));
        condition.flightdate = nowDate;
        this.update();
        this.setState({ dpValue: dateDefault ,nowDate:nowDate,condition});
    };

    //  下拉
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.update(false)
            .then( _ => {
                this.setState({
                    refreshing: false
                });
            })
        //this.refs.lv.scrollTo(0, 5400)
    };

    onEndReached = _ =>{
        let {isLoading,pageNow,hasMore,totalPageSize,condition} = this.state;

        if(totalPageSize < pageNow ){
            this.setState({
                hasMore:true
            });

            return;
        }

        this.setState({
            rollingState:true
        });

        if(isLoading && !hasMore) {
	        condition.pageNow = pageNow;
            //date = '2017-07-01';
            this.state.isLoading = false; //  改变但不刷新状态
            Api.post(url,condition)
                .then(res => {
                    if(res.errorCode == 0) {
                        let data = res.pageInfo.pageData;
                        array.push(...data);
                        pageNow+=1;
                        this.setState({
                            dataSource:dataSource.cloneWithRows(array),
                            pageNow:pageNow,
                            isLoading:true,
                            rollingState:false
                        })
                    }
                });
        }
    };

    onScroll = (e) => {
        //console.log(e,e.scroller.getValues().top);
        this.st = e.scroller.getValues().top;
        //this.domScroller = e;
    };

    rows = (s,v) => {
        return (
            <div key={v}>
                <Flex
                    justify="between"
                    className="flight-list"
                >
                    <FlexItem className="flight-FLT">{s.fltId || ''}</FlexItem>
                    <FlexItem>{s.actype || ''}</FlexItem>
                    <FlexItem>{s.flightdate || ''}</FlexItem>
                    <FlexItem>{s.gate || ''}</FlexItem>
                    <FlexItem className="flight-state">{s.status || ''}</FlexItem>
                </Flex>
            </div>
        )
    };

	LMrows = (s,v) => (
        <LMFlightList data={s} />
	);

    render(){
        const {dpValue,nowDate,condition} = this.state;
        const {refreshing,dataSource,hasMore,rollingState,width} = this.state;
        //console.log(condition);
	    let isLM = Boolean(localStorage.isLM);
        return (
                <Content
                    style={{paddingBottom:0}}
                    className={isLM?`flightChange lm-container`:`flightChange`}
                >
                    <Header title="FLT CHANGE" />
                    <div className="datePicker">
                        <div className="date-change date-increase" onClick={this.increase}></div>
                        <div className="date-change date-reduce" onClick={this.reduce}></div>
                        <DatePicker
                            mode="date"
                            extra="选择"
                            value={dpValue}
                            onChange={v => this.dateChange(v)}
                        >
                            <DatePickerChildren></DatePickerChildren>
                        </DatePicker>
                    </div>
                    <div
                        style={isLM?{padding:'0',marginTop: '1rem',width:width}:{marginTop: '1rem',padding:'0 .3rem'}}
                    >

                        <div className="tabs flight" style={isLM?{width:width}:{}}>
	                        {
		                        isLM?
                                    <ul className={`lm-flight title`}>
				                        {
					                        list.map( (s,v) =>
                                                <li ref={s.name} key={v}>{s.name}</li>
					                        )
				                        }
                                    </ul>:
                                    <div className="flight-title">
                                        <Flex
                                            justify="between"
                                        >
                                            <FlexItem>FLT NO</FlexItem>
                                            <FlexItem>AC TYPE</FlexItem>
                                            <FlexItem>TIME</FlexItem>
                                            <FlexItem>GATE</FlexItem>
                                            <FlexItem>STATUS</FlexItem>
                                        </Flex>
                                    </div>
	                        }

                            <ListViewComponent
                                dataSource={dataSource}
                                hasMore={hasMore}
                                rollingState={rollingState}
                                rows={ isLM?this.LMrows:this.rows }
                                refreshing={refreshing}
                                style={ isLM?{height:'76vh'}:{height:'82vh'} }
                                onScroll={this.onScroll}
                                onRefresh={this.onRefresh}
                                onEndReached = {this.onEndReached}
                            />
                        </div>
                    </div>
                </Content>
        )
    }
}

export default FlightGateChange;