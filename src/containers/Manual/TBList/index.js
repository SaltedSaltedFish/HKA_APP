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
import {manualTB} from "../../../actions/manual";
import Native from "../../../utils/Native";


let settimeout=null
const DatePickerChildren = props => {
	return (
		<div
			onClick={props.onClick}
			style={{
				lineHeight: ".4rem",
				minHeight:'.4rem',
				paddingLeft: '2rem'
			}}
		>
			{props.extra}
		</div>
	)
};

class Tblist extends Component {
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
			dpValueend:'',
			dpValue:'',
			boolean:true,
			array:[],
			condition:{}
		};

		// this.acreg = props.location.search.replace('?acreg','');
		this.url = 'tb/findTBList';
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
	}

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

	componentDidMount(){
		settimeout=null
	}

	componentWillUnmount(){
		this.props.dispatch(manualTB({
			...this.state,
			modalType:false
		}));
		this.setState = _ => {};
		window.clearTimeout(settimeout);
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
		return (
			<Link
				to={{
					pathname:'/tb_details',
					search:`${s.TECHNICALBULLETINID}`
				}}
				key={v}
			>
				<div className="list">
					<div className="list-top">
						TBNO：{s.TBNO}
						{/*<span>OPEN</span>*/}
						&nbsp;&nbsp;
						ATA：{s.ATA}
						{/*<span className={s.state}>{s.state}</span>*/}
					</div>
					<div className="list-top">
						EFFECTIVE DATE：{s.EFFECTIVEDATE}
						{/*<span>OPEN</span>*/}
						&nbsp;&nbsp;
						REVISION：{s.REVISION}
						{/*<span className={s.state}>{s.state}</span>*/}
					</div>

					<p className="list-describe">
						{s.SUBJECT}
					</p>
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
			value.startEffectDate = value.startEffectDate ? TimeConversion.TIME(value.startEffectDate) : ''
			value.endEffectDate = value.endEffectDate ? TimeConversion.TIME(value.endEffectDate) : ''
			if (value.startEffectDate != '' && value.endEffectDate != '') {
				let startTime = TimeConversion.getTime(value.startEffectDate);
				let endTime = TimeConversion.getTime(value.endEffectDate);
				if (startTime > endTime) {
					console.log('时间选择错误');
					Native.alert('Time selection error');
					return;
				}
				;
			}
			;
			settimeout = setTimeout(() => {
				if (!error) {
					let condition = {};
					condition = {...value};
					this.setState({
						modalType: false,
						condition
					});
					this.update()
				}
			}, 500)
		});
	}

	render(){
		const {
			modalType,dataSource,boolean,
			rollingState,hasMore,refreshing,dpValue,dpValueend
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="TB"
				>
					{boolean?<div className="icon icon-filter" onClick={this.modalType}></div>:null}
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
					prefixCls={`criteria-warp am-modal`}
					visible={modalType}
					popup = {false}
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					//title={`Criteria`}
				>
					<div className="from-input">
						<from className="submit">

							<label className="group-input">
								<span>ATA</span>
								<input type="text" {...getFieldProps('ata',{
									initialValue:''
								})}/>
							</label>

							<label className="group-input">
								<span>TBNo</span>
								<input type="text" {...getFieldProps('tbNo',{
									initialValue:''
								})}/>
							</label>

							<label className="group-input">
								<span>SUBJECT</span>
								<input type="text" {...getFieldProps('subject',{
									initialValue:''
								})}/>
							</label>

							<label className="group-input">
								<span>STARTEFFECTDATE</span>
								<DatePicker
									mode="date"
									extra=""
									value = {dpValue}
									onChange={_ => this.dateChange(_)}
									{...getFieldProps('startEffectDate',{
										initialValue:dpValue,
									})}
								>
									<DatePickerChildren></DatePickerChildren>
								</DatePicker>
							</label>

							<label className="group-input">
								<span>ENDEFFECTDATE</span>
								<DatePicker
									mode="date"
									extra=""
									value = {dpValueend}
									onChange={_ => this.dateendChange(_)}
									{...getFieldProps('endEffectDate',{
										initialValue:dpValueend,
									})}
								>
									<DatePickerChildren></DatePickerChildren>
								</DatePicker>
							</label>

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


Tblist = createForm()(Tblist);
Tblist = connect(state => {return {
	state:state.ManualAMM.tb
}})(Tblist);
export default Tblist;