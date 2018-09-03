import React,{ Component } from 'react';
import { Flex,Modal,Radio,ActivityIndicator,DatePicker, ListView } from 'antd-mobile';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import Content from '../../components/Content';
import ListViewComponent from '../../components/ListView';

import Api from '../../api/request';

class SMSIORList extends Component {
	constructor(props){
		super(props);

		this.state = {
			dataSource:false,
			pageNow:2,
			totalPageSize:0,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,

			condition:{
				reporttype:'IOR'
			},
			array:[]
		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.url = 'sms/repaort/list';
	};

	componentWillMount(){
		this.update();
	};

	componentWillUnmount(){
		this.setState = () => {};
	}

	update = _ => {
		let { array ,condition } = this.state;
		condition.pageNow = 1;
		return Api.post(this.url,condition)
			.then(res => {
				if (res.errorCode == 0) {
					array = res.pageInfo.pageData;
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

	rows = (s,v) => {
		return (
			<div className="list" key={v}>
				<div className="list-top">
					ACREG：{s.acreg}
					{/*<span>OPEN</span>*/}
					&nbsp;&nbsp;
					injury：{s.injury}
					<span className={s.status}>{s.status}</span>
				</div>
				<p className="list-describe">
					{s.eventdetails}
				</p>
			</div>
		)
	};

	render(){
		const {
			dataSource, rollingState,hasMore,refreshing
		} = this.state;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="IOR LIST" >

					<div className="icon icon-addSms">
						<Link to={{
							pathname:'/add_ior'
						}}/>
					</div>
				</Header>

				<div className="manualSelect-list" style={{padding:'.3rem'}}>
					<ListViewComponent
						style={{height:'88vh'}}
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
			</Content>
		)
	};
};

SMSIORList.propTypes = {};

export default SMSIORList;