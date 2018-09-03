import './Arriveals.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { ListView,Flex,Modal,List,Radio,ActivityIndicator } from 'antd-mobile';
import { connect} from 'react-redux';
import { withRouter } from 'react-router';

import Api from '../../../api/request';

import { schedule } from '../../../actions/arriveals';
import ListViewComponent from '../../../components/ListView';
import ListViewTest from '../../../components/ListViewTest';
/**/
import FlightList from '../../../components/FlightList';
import LMFlightList from '../../../components/LM/FlightList';
/**/

import { list } from '../../../data/lmFlight';

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;

class Departures extends Component {
	constructor(props){
		super(props);
		console.log(props);
		let isLM = true; //Boolean(localStorage.isLM);
		let nowDate = props.nowDate;
		let condition = {
			flightDate:props.nowDate,
			//arrflag:'1',
			//userFlag:isLM?'1':localStorage.identity
			userFlag:'1'
		};
		let state = {};

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});


		if ( props.flightState ) {

			state = props.flightState;

		} else {
			state = {
				condition,
				isLM,
				nowDate,
				change:false,
				num:'',
				width:'100%', //  ul宽,
				height:0,

				lmValue:{},  //  筛选
				lmShow:false,

				update:false,
				dataSource:false,
				number:0,
			}
		};


		this.state = {
			...state
		};

		this.st = 0;    //  y偏移值
		//props.condition.arrflag = '1';

		this.url = 'workflight/flightlist';

		this.data = [
			{ value: '2', label: 'Sort By Arrival Time' },
			{ value: '1', label: 'Sort by A/C' },
		];
	};


	componentWillMount(){

	};

	componentWillReceiveProps(nextProps){
		//console.log(nextProps);
		let { condition } = this.state;
		condition.flightDate = nextProps.nowDate;
		this.setState({
			update:true,
			condition,
			dataSource:false,
		}, () => this.update());
	};

	componentDidMount(){

		let width = 0;
		//console.log(this.refs);
		Object.keys(this.refs).map( s =>
			{
				if ( s == 'lv' || s == 'box' || s == 'boxTop') {

				} else {
					s == 'lv'?null:width += (this.refs[s].offsetWidth + 1);
				};
			}
		);

		//console.log(width);

		width += 'px';
		let height = this.refs.box.clientHeight - this.refs.boxTop.clientHeight;
		if (this.props.flightState) {
			this.setState({
				width,
				height
			});
			return;
		};

		this.setState({
			width,
			height
		},() => this.update())
	};

	update = () => {
		Api.post(this.url,{...this.state.condition})
			.then(res => {
				console.log(res);

				let data = [];

				if ( res.data ) {
					data = res.data;
				};

				this.setState({
					dataSource:this.dataSource.cloneWithRows(data),
					number:data.length
				});

			});
	};

	componentWillUnmount(){
		this.actions(this.state);
		this.setState = () => {};
	};

	actions = (obj) => {
		this.props.dispatch(schedule({
			...obj
		}));
	};

	link  = (e,obj) => {
		//console.log('点击');
		e.preventDefault();
		this.props.history.push('/flight_order?'+obj.acreg + '&' + obj.fltid + '&' + obj.flightdate);
	};

	/*
	* ata 实际到达时间
	* atd 实际起飞时间
	*
	* eta 预计到达时间
	* etd 预计起飞时间
	* */

	rows = (s) =>{
		return (
			<Link
				to={{
					pathname: '/flight_details',
					search: s.aclogid +'&'+this.state.nowDate,
				}}
			>
				<FlightList data={s} />
			</Link>
		)
	};

	LMrows = (s) => {
		return (
			<Link
				to={{
					pathname: '/flight_details',
					search: s.aclogid + '&' + s.nextAcFlightlog.aclogid + '&' + this.state.nowDate,
				}}
			>
				<LMFlightList data={s} />
			</Link>
		)
	};

	onChange = (lmValue) => {
		let { condition } = this.state;
		condition.orderby = lmValue.value;
		this.setState({
			lmValue,
			dataSource:false,
			lmShow:false,
			update:true,
			condition
		});
	};

	render(){
		const {
			change,width,lmValue,lmShow,condition,dataSource,isLM,number
		} = this.state;

		//let isLM = Boolean(localStorage.isLM);

		let style = {};

		if ( isLM && change ) {
			style =  { height:'67.5vh' };
		} else if ( isLM ){
			style = { height:'72.8vh' };
		} else if ( change ) {
			style = { height:'74vh' };
		};

		return (

			<div className={`lm-position ${lmShow?'lm-hidden':''}`} ref={`box`} style={{height: 'inherit'}}>

				<div className="lm-screen-box" style={lmShow?{display:'block'}:{display:'none'}}>
					<div className="lm-mark"></div>
					<div className="lm-screen">
						<List>
							{ this.data.map(i => (
								<RadioItem
									key={i.value}
									checked={lmValue.value === i.value}
									onChange={() => this.onChange(i)}
								>
									{i.label}
								</RadioItem>
							))}
						</List>
					</div>
				</div>

				<div className={isLM?`lm-container`:``} style={isLM?{padding:'0',width:width}:{padding:'0 .3rem 0'}}>

					{
						isLM?
							<ul className={`lm-flight title`} style={{height:'.75rem'}} ref={'boxTop'}>
								{
									list.map( (s,v) =>
										<li
											className={s.icon || null}
											ref={s.type}
											key={v}
											onClick={s.icon?()=>this.setState({lmShow:!this.state.lmShow,update:false}):null}
										>
											{s.name}
										</li>
									)
								}
							</ul>:null
					}

					<div
						style={{height:'100%'}}
					>
						{
							dataSource?
								dataSource._cachedRowCount == 0?
									<div className="noData hasPadding">No Data</div>:
									<ListView
										style={{
											height:this.state.height + 'px'
										}}
										dataSource={ dataSource }
										renderRow={ this.LMrows }
										initialListSize={ number }
										pageSize={ number }
										scrollRenderAheadDistance={200}
										scrollEventThrottle={20}
									/>:
								<ActivityIndicator />
						}
					</div>
				</div>
			</div>
		)
	}
}

Departures = withRouter(Departures);
Departures = connect(state => {return {
	flightState:state.ArrivalsState.schedule
}})(Departures);
export default Departures;