import '../details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import { Modal,ActivityIndicator,DatePicker,ListView } from 'antd-mobile';;

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';




class IpcDetails extends Component {
	constructor(props){
		super(props);
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
			array:[],
			condition:{}
		};

		// this.acreg = props.location.search.replace('?acreg','');
		this.url = 'ipc/findIPCInfoByKey';
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
	}

	componentWillMount(){
		this.update();
	};

	componentDidMount(){
	}

	componentWillUnmount(){
		this.setState = _ => {};
	};

	update = _ => {
		let { array ,condition } = this.state;
		condition.pageNow = 1;
		let s=this.props.location.search.replace('?','');
	       let 	keypn = s.split("&&");
		condition.key=keypn[0];
			condition.partnumber = keypn[1];
		condition.acreg = keypn[2];
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
		return (

				<div className="list">
					<div className="list-top">
						<ul className="c666">UNITPERASSY：</ul><ul className="c333">{s.UNITPERASSY}</ul>
						&nbsp;&nbsp;&nbsp;
						<ul className="c666">ITEM：</ul><ul className="c333">{s.ITEM}</ul>
					</div>
					<div className="list-describe list-top" >
						<ul className="c666">NOMENCLATURE：</ul><ul className="c333">{s.NOMENCLATURE}</ul>
					</div>
					<div className="list-top" style={{marginTop:'.25rem'}}>
						<ul className="c666">PARTNUMBER：</ul>	<ul className="c333">{s.PARTNUMBER}</ul>
					</div>
					<div className="list-top">
						<ul className="c666">	FINACCESS：</ul><ul className="c333">{s.FINACCESS}</ul>
					</div>
				</div>

		)
	};





	render(){
		const {dataSource,
			rollingState,hasMore,refreshing
		} = this.state;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="IPC DETAILS"
				>
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

			</Content>
		)
	}
}



export default IpcDetails;