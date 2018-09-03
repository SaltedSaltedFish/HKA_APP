import './index.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Flex,Modal,Radio,ActivityIndicator, ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;
const dataSource = new ListView.DataSource({
	rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

let array = [],condition = {},typeBoolean,SBORMOD,Implementation;
let url = `add/getAddList`;

class MaterialQuery extends Component {
	constructor(){
		super();
		this.state = {
			dataSource:false,
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

		this.url = `add/getAddList`;
	}

	componentWillMount(){
		//this.update();
	};

	componentDidMount(){

	}

	componentWillUnmount(){
		this.setState = _ => {};
	};

	update = _ => {
		const {condition} = this.state;
		condition.pageNow = 1;
		return Api.get(url,condition)
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					array = res.data;
					this.state.dataSource = '';
					this.refs.lv?this.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;
					this.setState({
						dataSource:dataSource.cloneWithRows(array),
						totalPageSize:res.pageInfo.totalPageSize,
						isRequest:false,
						hasMore:false,
						pageNow:2
					})
				} else {
					this.setState({
						isRequest:false
					})
				}
			})
	};

	//  下拉
	onRefresh = () => {
		this.setState({ refreshing: true});
		this.update(false)
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
		let {isLoading,pageNow,hasMore,totalPageSize} = this.state;

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

			Api.get(url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data;
						data = res.data;
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

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			if (!error) {
				let condition = {};
					condition = {...value};
				this.setState({
					modalType:false,
					condition
				},this.update());
			}
		});
	};

	render(){
		const {modalType,isRequest,dataSource, rollingState,hasMore,refreshing} = this.state;
		const { getFieldProps } = this.props.form;
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
					<p className="title">Material</p>
					{/*<div className="icon icon-filter" onClick={this.modalType}></div>*/}
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

				<Modal
					visible={modalType}
					popup = {false}
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					className="modalSelect newView"
					title={
						<div id="common-header">
							<div
								className="back"
								onClick={this.modalTypeCancel}
							>
							</div>
							<p className="title">Criteria</p>
						</div>
					}
				>
					<div className="from-input">
						<from className="submit">
							<div className="group-input">
								<span>ACREG</span>
								<input type="text" {...getFieldProps('acreg',{
									initialValue:''
								})}/>
							</div>

							<div className="group-input">
								<span>ADD NO.</span>
								<input type="text" {...getFieldProps('addno',{
									initialValue:''
								})}/>
							</div>

							<div className="group-input">
								<span>STATUS</span>
								<input type="text" {...getFieldProps('status',{
									initialValue:''
								})}/>
							</div>

							<div className="group-button">
								<div className="button" onClick={this.submit}>
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

MaterialQuery = createForm()(MaterialQuery);
export default MaterialQuery;