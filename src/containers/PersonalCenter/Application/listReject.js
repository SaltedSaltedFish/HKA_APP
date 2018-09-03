import './index.css';

import React,{Component} from 'react';
import {ListView,ActivityIndicator} from 'antd-mobile';
import {Link} from 'react-router-dom';
import Api from '../../../api/request';
import ListViewComponent from '../../../components/ListView';
import Group from './group';

class Reject extends Component {
	constructor(props){
		super(props);
		let pathname = props.pathname;
		this.state = {
			dataSource:false,
			pageNow:2,
			totalPageSize:0,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,

			pathname,

			condition:{
				role:props.identity?'0':'1',
				pageNow:'1',
				status:'1'
			}
		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.timer = {};

		this.url = 'message/delay/list';
	};

	componentWillMount(){
		this.update();
	};

	componentWillUnmount(){
		clearTimeout(this.timer);
		this.setState = _ => {};
	};

	componentWillReceiveProps(nextProps){
		//console.log(nextProps);
		this.setState({
			dataSource:false
		});
		this.update(nextProps);
	};

	update = _ => {
		this.state.dataSource = false;  //  清空
		const { condition } = this.state;
		return Api.post(this.url,condition)
			.then(res => {
				if(res.errorCode == 0) {
					let data = res.pageInfo.pageData;
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

	rows(data,v){
		return (
			<Link
				to={{
					pathname:this.state.pathname,
					state:data
				}}
				key={v}
			>
				<Group data={data} />
			</Link>
		)
	}

	onRefresh = () => {
		this.setState({ refreshing: true });
		this.update()
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
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
			this.state.isLoading = false; //  改变但不刷新状态
			condition.pageNow = pageNow;
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
							rollingState:false
						})
					}
				});
		}
	};

	render(){
		const {refreshing,dataSource,hasMore,rollingState} = this.state;
		return (
			<div>
				{
					!dataSource?<ActivityIndicator />:
						<ListViewComponent
							dataSource={dataSource}
							hasMore={hasMore}
							rollingState={rollingState}
							rows={this::this.rows}
							refreshing={refreshing}
							onRefresh={this.onRefresh}
							onEndReached = {this.onEndReached}
						/>
				}
			</div>
		)
	}
}

export default Reject;