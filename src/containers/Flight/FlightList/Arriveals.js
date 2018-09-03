import './Arriveals.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import Api from '../../../api/request';
import { connect} from 'react-redux';
import { history } from '../../../actions/arriveals';
import { RefreshControl, ListView,Flex ,ActivityIndicator} from 'antd-mobile';
import ListViewComponent from '../../../components/ListView';

const FlexItem = Flex.Item;

class Arriveals extends Component {
    constructor(props){
        super(props);
		this.state = {
			dataSource:false,
			refreshing:false,
			isLoading:true,
			pageNow:2,
			hasMore:false,
			totalPageSize:0,
			rollingState:false,
			condition : {
				flightdate:props.nowDate,
				arrflag:'0'
			},

			array:[],
			date:''
		};
		this.st = 0;    //  y偏移值
		//props.condition.arrflag = '1';
		this.url = 'acflight/flight/list';
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.timer = null;
    }

	componentWillMount(){
		if(this.props.flightState){
			this.setState({
				...this.props.flightState
			});
			return;
		}

		this.update();
	}

    componentDidMount(){

    };

	componentWillReceiveProps(nextProps){
		this.update(nextProps);
	};


	componentWillUnmount(){
		this.props.dispatch(history({
			...this.state
		}));

		clearTimeout(this.timer);
		this.setState = _ => {};
	};


	update = _ => {
		let { condition } = this.state;
		if (_) {
			condition.flightdate = _.nowDate;
		};
		condition.pageNow = '1';

		this.state.date = condition.flightdate;

		if (_ != false) {
			this.state.dataSource = false;  //  清空
		}
		this.timer?clearTimeout(this.timer):null;
		return Api.post(this.url,condition)
			.then(res => {
				if(res.errorCode == 0) {
					this.timer = setTimeout(_=>{
						let data = res.pageInfo.pageData;
						this.state.array = data;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(data),
							totalPageSize:res.pageInfo.totalPageSize,
							hasMore:false,
							pageNow:2,
							condition
						})
					},100);
				}
			})
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
			this.state.isLoading = false; //  改变但不刷新状态
			Api.post(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data = res.pageInfo.pageData;
						this.state.array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(this.state.array),
							pageNow:pageNow,
							isLoading:true,
							rollingState:false,
							condition
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

    rows = (s,v) =>{
        return (
            <Link
                to={{
                    pathname: '/flight_details',
                    search: s.aclogid +'&'+this.state.date,
                }}
                key={v}
            >
                {/*<Flex*/}
                    {/*justify="between"*/}
                    {/*className="flight-list"*/}
                {/*>*/}
                    {/*<FlexItem className="flight-FLT">{s.fltid}</FlexItem>*/}
                    {/*<FlexItem>{s.acreg}</FlexItem>*/}
                    {/*<FlexItem>{s.ataFomat}</FlexItem>*/}
                    {/*<FlexItem>{s.gate}</FlexItem>*/}
                    {/*<FlexItem className="flight-state">{s.status}</FlexItem>*/}
                {/*</Flex>*/}

				<div className="departuresone">
					<Flex
						justify="end"
						style={{paddingBottom:'0.3rem'}}
					>
						<FlexItem className="fltno">FLT_NO</FlexItem>
						<FlexItem  className="fltid">{s.fltid}</FlexItem>
						{/*<FlexItem></FlexItem>*/}
						<FlexItem className="fltno" style={{marginLeft:'0.3rem'}}>ACREG</FlexItem>
						<FlexItem  className="fltid">{s.acreg}</FlexItem>
					</Flex>
					<Flex
						justify="end"
						style={{paddingBottom:'0.3rem'}}
					>
						<FlexItem className="fltno">STA</FlexItem>
						<FlexItem  className="fltid">{s.sta}</FlexItem>
						<FlexItem className="fltno" style={{marginLeft:'0.6rem'}}>GATE</FlexItem>
						<FlexItem  className="fltid">{s.gate}</FlexItem>
					</Flex>
					<Flex
						justify="end"
					>
						<FlexItem className="fltno">TASK</FlexItem>
						<FlexItem  className="fltid">10</FlexItem>
						<FlexItem className="fltno" style={{marginLeft:'0.6rem'}}>STATUE</FlexItem>
						<FlexItem style={{color:'#ffa800'}}>{s.status}</FlexItem>
					</Flex>
				</div>
				<div className="departurestwo">
					<div style={{height:'0.3rem'}}>
						<div className="hka">HKA</div>
						<div className="hkatosk"></div>
						<div className="sk">SK</div>
					</div>
					<div style={{marginTop:'0.26rem'}}>
						<span style={{color:'#929292'}}>ETA</span>
						<span>{s.etaFomat} / </span>
						<span style={{color:'#929292'}}>AR</span>
						<span>12:00</span>
						<span style={{color:'#929292',marginLeft:'0.34rem'}}>ETL</span>
						<span>13:00 / </span>
						<span style={{color:'#929292'}}>AL</span>
						<span>18:00</span>
					</div>
				</div>
            </Link>
        )
    };

    render(){
        const {refreshing,dataSource,hasMore,rollingState} = this.state;
        return (
            <ListViewComponent
                dataSource={dataSource}
                hasMore={hasMore}
                rollingState={rollingState}
                rows={this.rows}
                refreshing={refreshing}
                onScroll={this.onScroll}
                onRefresh={this.onRefresh}
                onEndReached = {this.onEndReached}
            />
        )
    }
}

Arriveals = connect(state => {return {
	flightState:state.ArrivalsState.history
}})(Arriveals);
export default Arriveals;