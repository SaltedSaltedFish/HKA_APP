import './indx.less';

import React,{Component} from 'react';
import {ActivityIndicator, ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';

import Content from '../../components/Content';
import ListViewComponent from '../../components/ListView';
import Api from '../../api/request';

class DelayReportList extends Component {
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

			isRequest:true,

			boolean:true,
			array:[],
			condition:{}
		};

		// this.acreg = props.location.search.replace('?acreg','');
		this.url = 'add/getAddList';
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
	}

	componentWillMount(){
		console.log(this.props);
		const {condition}=this.state;
		let acreg = this.props.location.search.replace('?','');
		if(acreg){
			condition.acreg=acreg;
			this.setState({
				boolean:false
			});
			this.update();
		}else {
			this.setState({
				boolean:true,
				condition:{},
			});
			this.update();
		}

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
		return Api.get(this.url,condition)
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					array = res.data;

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

			Api.get(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data;
						data = res.data;
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
		return (
			<Link
				to={{
					pathname:'/manual_menuADD',
					search:s.addid
				}}
				key={v}
			>
				<div className="list">
					<div className="list-top">
						ACREG：{s.acreg}
						{/*<span>OPEN</span>*/}
						&nbsp;&nbsp;
						ADD NO.：{s.addno}
						<span className={s.state}>{s.state}</span>
					</div>
					<p className="list-describe">
						{s.defectDesc}
					</p>
				</div>
			</Link>
		)
	};

	render(){
		const {
			modalType,dataSource,boolean,
			rollingState,hasMore,refreshing,dpValue
		} = this.state;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<div id="common-header">
					<div
						className="back"
						onClick={ () => this.props.history.goBack()}
					>
					</div>
					<p className="title">ADD</p>

					{boolean?<div className="icon icon-filter" onClick={this.modalType}></div>:null}

				</div>
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
			</Content>
		)
	}
}

export default DelayReportList;