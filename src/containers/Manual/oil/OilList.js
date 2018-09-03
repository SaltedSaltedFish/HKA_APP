import '../details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import { Modal,ActivityIndicator,DatePicker,ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';


class OilList extends Component {
	constructor(props){
		super(props);
		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		this.state = {
			dataSource:false,
			nums:10,
			pageNow:2,
			totalPageSize:0,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,
			isRequest:true,
			dpValueend:zhNow,
			dpValue:zhNow,
			boolean:true,
			array:[],
			condition:{}
		};

		this.url = 'tlb/list';
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
	}

	componentWillMount(){
		this.update();
	};

	componentDidMount(){
		console.log(this.refs.lv);
	}

	componentWillUnmount(){
		this.setState = _ => {};
	};

	update = _ => {
		let { array ,condition } = this.state;
		condition.pageNow = 1;
		return Api.post(this.url,condition)
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					array = res.pageInfo.pageData;
					this.state.dataSource = '';
					//_?_.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;

					this.setState({
						dataSource:this.dataSource.cloneWithRows(array),
						totalPageSize:res.pageInfo.totalPageSize,
						isRequest:false,
						hasMore:false,
						pageNow:2,
						array
					})
				} else {
					this.setState({
						isRequest:false
					})
				}
			})
	};

	//  下拉
	onRefresh = (_) => {
		this.setState({ refreshing: true});
		this.update(_)
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
		let {isLoading,pageNow,hasMore,totalPageSize,array,condition} = this.state;

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

			Api.post(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data;
						data = res.pageInfo.pageData;
						array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(array),
							pageNow:pageNow,
							isLoading:true,
							rollingState:false
						})
					}
				});
		}
	};

	rows(s,v){
		let TLB_DATE=TimeConversion.TIME(s.TLB_DATE)
		return (
               <Link
				   to={{
					   pathname:'/addoil',
					   search:`${s.ACREG}&&${s.LPNUM}`
				   }}
				   key={v}
			   >
				<div className="list">
					<div className="list-top">
						ACREG：{s.ACREG}
						&nbsp;&nbsp;
						ACTYPE：{s.ACTYPE}
					</div>
					<div className="list-describe list-top">
						LPNUM：{s.LPNUM}
						&nbsp;&nbsp;
						FLIGHTNUMBER：{s.FLIGHTNUMBER}
					</div>

					<div>
						TLB_DATE:{TLB_DATE}
					</div>
				</div>
               </Link>
		)
	};
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

	dateendChange = _ => {
		this.setState({ dpValueend: _ });
	};

	submit = _ => {
		this.props.form.validateFields((error, value) => {
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
	linkto=()=>{
		window.location.href="#/addoil";
	}
	render(){
		const {
			modalType,dataSource,
			rollingState,hasMore,refreshing
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="Oil"
				>
				<div className="icon icon-filter" onClick={this.modalType}></div>
					<div className="icon icon-filter"  style={{right:'1rem'}} onClick={this.linkto}></div>
				</Header>
				<div className="manual-details newView">
					{
						!dataSource?<ActivityIndicator />:
							<div className="manualSelect-list">
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
							</div>
					}
				</div>

				<Modal
					visible={modalType}
					// popup = {false}
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					title={`Criteria`}
				>
					<div className="from-input">
						<from className="submit">
							<div className="group-input">
								<span>ACTYPE</span>
								<input type="text" {...getFieldProps('ACTYPE',{
									initialValue:''
								})}/>
							</div>

							<div className="group-input">
								<span>ACREG</span>
								<input type="text" {...getFieldProps('ACREG',{
									initialValue:''
								})}/>
							</div>

							<div className="group-input">
								<span>LPNUM</span>
								<input type="text" {...getFieldProps('LPNUM',{
									initialValue:''
								})}/>
							</div>
							<div className="group-button">
								<div className="button red" onClick={this.submit}>
									Submit
								</div>
							</div>
						</from>
					</div>
				</Modal>
			</Content>
		)
	}
}


OilList = createForm()(OilList);
export default OilList;