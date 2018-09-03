import './index.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { ListView,Flex,Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { connect} from 'react-redux';
import {manualNRC} from "../../../actions/manual";

import Api from '../../../api/request';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';

const FlexItem = Flex.Item;

class AddedList extends Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
			dataSource:false,
			pageNow:2,
			totalPageSize:0,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,

			array:[],

			modalType:false,

			condition:{

			}
        };

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.url = 'nrc/list';
    };

	componentWillMount(){
		let cache=false
		if(this.props.location.state) {
			cache = this.props.location.state.cache
		}else {
			cache=false
		}
		if(this.props.state&&!cache){
			this.setState({
				...this.props.state
			});

			return;
		};

		this.update();

	};
	componentWillUnmount(){
		this.props.dispatch(manualNRC({
			...this.state,
			modalType:false
		}));
		this.setState = _ => {};
	};

	update = _ => {
		const { condition } = this.state;
		condition.pageNow = 1;
		return Api.post(this.url,condition)
			.then(res => {
				console.log(res);
				if(res.errorCode == 0) {
					let data = res.pageInfo.pageData;
					console.log(data);
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

	rows(s,v){
		return (
			<Link
				to={{
					pathname: '/nrc_details',
					search:`?regid=${s.regid}`
				}}
				key={v}
			>
				<div className="work-list">
					<div className="list-bottom">
						<Flex
							justify="between"
						>
							<FlexItem>
								<div className="list-info">
									<p className="list-color2">CHECK</p>
									<p>{s.checktype}</p>
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
									<p>{s.acreg}</p>
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
									<p className="list-color2">ZONE</p>
									<p>{s.zone}</p>
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
									<p className="list-color2">ATA</p>
									<p>{s.ata}</p>
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

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			if (!error) {
				this.setState({
					modalType:false,
					condition:value
				},this.update);
			}
		});
	};

    render(){
        const {refreshing,dataSource,hasMore,rollingState,modalType} = this.state;
		const { getFieldProps } = this.props.form;
        return (
        	<Content
				style={{paddingBottom:0}}
			>

				<Header
					title="NRC"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div style={{padding:'.3rem'}} className="nrcList">
					<ListViewComponent
						dataSource={dataSource}
						hasMore={hasMore}
						rollingState={rollingState}
						rows={ this.rows }
						refreshing={ refreshing }
						onRefresh={ this.onRefresh }
						onEndReached = { this.onEndReached }
					/>
				</div>

				<Modal
					prefixCls={`criteria-warp am-modal`}
					visible={modalType}
					transparent
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					style={{width:'90%'}}
					//title={`Criteria`}
				>
					<div className="from-input">
						<from className="submit">
							{/*<div className="group-input">*/}
								{/*<span>ATA</span>*/}
								{/*<input type="text" {...getFieldProps('ata',{*/}
									{/*initialValue:''*/}
								{/*})}/>*/}
							{/*</div>*/}

							<div className="group-input">
								<span>Acreg</span>
								<input type="text" {...getFieldProps('acreg',{
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

AddedList = createForm()(AddedList);
AddedList = connect(state => {return {
	state:state.ManualAMM.nrc
}})(AddedList);
export default AddedList;

