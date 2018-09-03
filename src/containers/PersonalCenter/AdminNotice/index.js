import './index.less';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { ListView ,Flex,Modal,DatePicker } from 'antd-mobile';
import {connect} from 'react-redux';

import getState from '../../../utils/getState';
import Api from '../../../api/request';
import { alarm } from '../../../actions/workOrder';
import TimeConversion from '../../../utils/TimeConversion';

import ListViewComponent from '../../../components/ListView';
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import { createForm } from 'rc-form';
import moment from 'moment';

const FlexItem = Flex.Item;
const DatePickerChildren = props => {
	return (
		<div
			onClick={props.onClick}
			style={{
			// 	lineHeight: '1.5',
			// 	height: '15px',
				paddingLeft: '2rem'
			}}
		>
			{props.extra}
		</div>
	)
};
class AdminNotice extends Component {
	constructor(props){
		super(props);

		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		let role = localStorage.identity;

		this.state = {
			dataSource:false,
			refreshing:false,
			isLoading:true,
			pageNow:2,
			taskState:'',
			hasMore:false,
			totalPageSize:0,
			rollingState:false,
			condition:{role},
			isUpdate:false,
			dpValueend:zhNow,
			dpValue:zhNow,
			array:[],
			modalType:false,
			listViewHeight:0
		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.url = 'taskmonitor/findAllTaskInfo';
	}

	componentWillMount(){
		let cache=false;

		if(this.props.location.state) {
			 cache = this.props.location.state.cache
		}else {
			cache=false
		};

		if(this.props.state&&!cache){
			this.setState({
				...this.props.state
			});
			return;
		};

		this.update();
	}

	componentWillUnmount(){

		this.props.dispatch(alarm({
			...this.state
		}));
		this.setState = _ => {};
	}

	componentDidMount(){
		// //this.refs.lv.scrollTo(0,100);
		// //console.log(StateHeight,document.getElementsByClassName('listViewContainer')[0].clientHeight);
		let listViewHeight = document.getElementsByClassName('listViewContainer')[0].clientHeight;
		this.setState({
			listViewHeight,
		})
	}

	update = _ => {
		let {  condition } = this.state;
		condition.pageNow = 1;
		return Api.get(this.url,condition)
			.then(res => {
				//console.log(res);
				if(res.errorCode == 0) {
					let data = res.pageInfo.pageData;
					//console.log(data,num);
					this.state.array = data;
					this.setState({
						dataSource:this.dataSource.cloneWithRows(data),
						totalPageSize:res.pageInfo.totalPageSize,
						hasMore:false,
						pageNow:2
					})
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
	};

	onEndReached = () =>{
		let {condition,isLoading,pageNow,hasMore,totalPageSize} = this.state;

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
			this.state.isLoading = false; //  改变但不刷新状态
			condition.pageNow = pageNow;
			Api.get(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data = res.pageInfo.pageData;
						this.state.array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(this.state.array),
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
		this.domScroller = e;
	};

	rows(s,v,condition){
		let listState = getState.state(s.TASKCOMPLETION?s.TASKCOMPLETION:'');
		let DUEDATE=""
		if(s.DUEDATE){
			DUEDATE=TimeConversion.TIME(s.DUEDATE)
		}
		return (
			<div
				className="work-list"
				key={v}
			>
				<Link
					to={{
						pathname: '/details_assigned',
						search: '?id='+ s.ASSIGNWORKID,
						state:{
							id:s.ASSIGNWORKID
						}
					}}
				>
				<div className={`state ${listState}`}>
					<div></div>
					<p>{listState}</p>
				</div>
				<div className="list-top">
					<div className="introduction">
						<p className="title">{s.WONO}</p>
						<p className="list-color1">RN: {s.RN}</p>
					</div>
				</div>
				<div className="list-bottom">
					<Flex
						justify="between"
					>
						<FlexItem>
							<div className="list-info">
								<p className="list-color2">DUEDATE</p>
								<p>{DUEDATE}</p>
								<span
									style={{
										width:'1px',
										top:'5px'
									}}
								></span>
							</div>
						</FlexItem>
						<FlexItem>
							<div className="list-info">
								<p className="list-color2">ACREG</p>
								<p>{s.ACREG}</p>
								<span
									style={{
										width:'1px',
										top:'5px'
									}}
								></span>
							</div>
						</FlexItem>
						<FlexItem
							style={{flex:1.2}}
						>
							<div className="list-info">
								<p className="list-color2">TASKNO</p>
								<p>{s.TASKNO}</p>
								<span
									style={{
										width:'1px',
										top:'5px'
									}}
								></span>
							</div>
						</FlexItem>
					</Flex>
				</div>
				</Link>
			</div>

		)
	}
	modalType = _ => {
		this.setState({
			modalType:true
		});
	};

	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType:false
		});
	};

	dateChange = _ => {
		this.setState({ dpValue: _ });
	};
	submit = _ => {
		this.props.form.validateFields((error, value) => {
			value.assignDate=TimeConversion.TIME(value.assignDate)
			setTimeout(()=>{
				if (!error) {
					let condition = {};
					condition = {...value};
					this.setState({
						modalType:false,
						condition
					});
					this.update()
				}},500)
		});
	};

	render(){
		const {refreshing,listViewHeight,dataSource,hasMore,condition,rollingState,
			modalType,dpValue
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{
					paddingBottom:0,
					paddingTop:'1.2rem'
				}}
			>
				<Header title="ALARM">
				<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div className="listViewContainer" style={{
					padding:'0 0.3rem',
					height:'100%'
				}}>
					<ListViewComponent
						style={{height:listViewHeight+'px'}}
						dataSource={dataSource}
						hasMore={hasMore}
						rollingState={rollingState}
						rows={(s,v)=> this.rows(s,v,condition)}
						refreshing={refreshing}
						onScroll={this.onScroll}
						onRefresh={this.onRefresh}
						onEndReached = {this.onEndReached}
					/>

					<Modal
						visible={modalType}
						popup = {false}
						transparent
						animationType="slide-down"
						onClose={this.modalTypeCancel}
						style={{width:'90%'}}
						title={`Criteria`}
					>
						<div className="from-input">
							<from className="submit">
								<div className="group-input">
									<span>TEAMS</span>
									<input type="text" {...getFieldProps('teams',{
										initialValue:''
									})}/>
								</div>

								<div className="group-input">
									<span>ENGINEERNAME</span>
									<input type="text" {...getFieldProps('engineer',{
										initialValue:''
									})}/>
								</div>

								<div className="group-input">
									<span>WORLPACKAGENO</span>
									<input type="text" {...getFieldProps('workPackageNo',{
										initialValue:''
									})}/>
								</div>
								<div className="group-input">
									<span>TASKNO</span>
									<input type="text" {...getFieldProps('taskNo',{
										initialValue:''
									})}/>
								</div>

								<div className="group-input">
									<span>ASSIGNDATE</span>
									<DatePicker
										mode="date"
										extra=""
										value = {dpValue}
										onChange={_ => this.dateChange(_)}
										{...getFieldProps('assignDate',{
											initialValue:dpValue,
											rules: [{ required: true}]
										})}
									>
										<DatePickerChildren></DatePickerChildren>
									</DatePicker>
								</div>
								<div className="group-button">
									<div className="button red" onClick={this.submit}>
										Submit
									</div>
								</div>
							</from>
						</div>
					</Modal>
				</div>
			</Content>
		)
	}
}
AdminNotice = createForm()(AdminNotice);
AdminNotice = connect(state => {return {
	state:state.AdminWorksheetList.alarm
}})(AdminNotice);
export default AdminNotice;