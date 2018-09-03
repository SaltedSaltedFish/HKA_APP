import '../details.less';

import React,{Component} from 'react';
import { ActivityIndicator,List,ListView,RefreshControl, } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
// import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';
import {Link} from 'react-router-dom';
// import {ListView} from "antd-mobile/lib/index";




class MelDetailsthree extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource:false,
			condition:{},
			dataSource:false,
			pageNow:2,
			totalPageSize:0,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,
			isRequest:true,
			array:[],
		};
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
	}

	componentDidMount(){
		this.update();
	}

	componentWillUnmount(){
		// this.setState = _ => {};
	};

	update = () => {
		let {condition, array} = this.state;
		condition.pageNow = 1
		let ids = this.props.location.search.replace('?', '');
		let fp = ids.split("&&");
		condition.fileId = fp[0];
		if (fp[2] == 'search') {
			condition.title = fp[1]
			this.url = 'mel/findMELInfoByTitle'
		} else {
			condition.parentId = fp[1];
			condition.level = 4
			this.url = 'mel/findMELList'
		}
		return Api.post(this.url, condition)
			.then(res => {

				if (res.errorCode == "0") {
					array = res.pageInfo.pageData;
					this.state.dataSource = '';
					//_?_.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;

					this.setState({
						dataSource: this.dataSource.cloneWithRows(array),
						totalPageSize: res.pageInfo.totalPageSize,
						isRequest: false,
						hasMore: false,
						pageNow: 2,
						array
					})
				} else {
					this.setState({
						isRequest: false
					})
				}
			})
	};

	//  下拉
	onRefresh = (_) => {
		this.setState({refreshing: true});
		this.update(_)
			.then(_ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
		let {isLoading, pageNow, hasMore, totalPageSize, array, condition} = this.state;

		if (totalPageSize < pageNow) {
			this.setState({
				hasMore: true
			});

			return;
		}

		this.setState({
			rollingState: true
		});

		if (isLoading && !hasMore) {
			this.state.isLoading = false; //  改变但不刷新状态
			condition.pageNow = pageNow;

			Api.post(this.url, condition)
				.then(res => {
					if (res.errorCode == "0") {
						let data;
						data = res.pageInfo.pageData;
						array.push(...data);
						pageNow += 1;
						this.setState({
							dataSource: this.dataSource.cloneWithRows(array),
							pageNow: pageNow,
							isLoading: true,
							rollingState: false
						})
					}
				});
		}
	};

	rows=(s,v)=>{
		const {condition}=this.state
		return (

			<Link
				to={{
					pathname: '/melDetailslast',
					search: `${condition.fileId}&&${s.ID}&&${s.NODETYPE}`
				}}
				key={v}
				className="melbc"
			>
				<div style={{backgroundColor: '#ddd', height: '1PX', width: '100%'}}></div>
				<List.Item>
					<div className="dt">{s.NAME}</div>
				</List.Item>

			</Link>

		)
	};

	renderCustomIcon() {
		return [
			<div key="0" className="am-refresh-control-pull">
				<span>Pull down to refresh</span>
			</div>,
			<div key="1" className="am-refresh-control-release">
				<span>Release to refresh</span>
			</div>,
		];
	};

	renderCustomLoading(){
		return [
			<div key="0">
				<ActivityIndicator />
			</div>
		]
	};
	render(){
		const {
			dataSource,
			rollingState,hasMore,refreshing
		} = this.state;

		return (
			<Content
				style={{paddingBottom:0,overflow:'hidden'}}
			>
				<Header
					title="MEL DETAILS...."
				>
				</Header>
				<div style={{overflow:'hidden'}}>
					{
						!dataSource ? <ActivityIndicator/> :
							<ListView
								dataSource={dataSource}
								renderRow={(s, v) => this.rows(s, v)}
								// initialListSize={nums}
								pageSize={15}
								scrollRenderAheadDistance={0}
								initialListSize={0}
								scrollEventThrottle={20}
								scrollerOptions={{scrollbars: false}}
								refreshControl={<RefreshControl
									refreshing={refreshing}
									onRefresh={this.onRefresh}
									icon={this.renderCustomIcon()}
									loading={this.renderCustomLoading()}
								/>}
								style={{height: document.documentElement.clientHeight - document.documentElement.clientWidth / 8.4}}
								onEndReached={this.onEndReached}
								onEndReachedThreshold={0}
								renderFooter={() => (
									dataSource._cachedRowCount > 0 ?
										(
											dataSource._cachedRowCount < 15 || hasMore && rollingState ?
												null :
												<div style={{textAlign: 'center'}}>
													{hasMore ? 'Loaded' : 'Loading...'}
												</div>
										)
										:
										<div className="noData">
											No Data
										</div>
								)}
							/>
					}

				</div>

			</Content>
		)
	}
}

export default MelDetailsthree;