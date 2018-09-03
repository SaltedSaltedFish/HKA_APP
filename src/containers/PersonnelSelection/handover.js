import './index.css';

import React,{Component} from 'react';
import {Tabs,DatePicker,Toast,ListView,Modal,List,Flex,ActivityIndicator,Radio} from 'antd-mobile';
import { createForm } from 'rc-form';

import Api from '../../api/request';

import ListViewComponent from '../../components/ListView';
import Content from '../../components/Content';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import Native from '../../utils/Native';
import { sort_team } from '../../utils/small_tools';

let assignworkid,username,assignworkidtasknum,tasknum;

class EngineerSelection extends Component {
	constructor(props){
		super(props);

		this.state = {
			selectDay:0,
			selectNight:0,
			data:null,
			activeKey:'day',
			upUp:false,
			condition:{},
			isLoading:true,
			selected:'',
			engineer:'',
			modalType:false,
			licensevalue:'',
			licenselabel:'ALL',
			typevalue:'',
			typelabel:'ALL'

		};
		//this.url = 'schedule/findDayScheduleList';
		this.url = '/scheduleday/getuser';

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		assignworkidtasknum = props.location.search.replace('?','').split("&");
		assignworkid = assignworkidtasknum[0];
		tasknum = assignworkidtasknum[1] + ',' + assignworkidtasknum[2] + ',' + assignworkidtasknum[3];
		username = localStorage.userAccount;

	};

	componentWillMount(){

	};

	componentWillUnmount(){
		this.setState = _ => {};
	}

	update = _ => {
		let { array ,condition } = this.state;
		// let type=document.getElementById("type");
		// let typevalue= type.options[type.options.selectedIndex].value
		// let license=document.getElementById("license");
		// let licensevalue= license.options[license.options.selectedIndex].value
		condition.pageNow = 1;
		//condition.type = this.state.typevalue;
		//condition.license = this.state.licensevalue;
		//condition.time = nowDates;

		Api.post(this.url,condition)
			.then(res => {
				if (res.errorCode == 0) {
					array = sort_team(res.data);

					this.state.dataSource = '';
					//_?_.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;

					this.setState({
						dataSource: this.dataSource.cloneWithRows(array),
						//totalPageSize: res.pageInfo.totalPageSize,
						isRequest: false,
						hasMore: false,
						pageNow: 2,
						array,
						refreshing:false,
					})
				} else {
					this.setState({
						isRequest: false,
						refreshing:false,
					})
				}
			})
	};

	onRefresh = (_) => {
		this.setState({ refreshing: true});
		this.update(_)
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
	componentDidMount(){
		this.update();
	}

	modalType = (licensetype) => {
		this.setState({
			modalType:true,
			licensetype
		});
	};
	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType:false
		});
	};

	toggle = () => {
		this.setState({
			modalType:!this.state.modalType
		})
	};

	onChange = (valueType,label) => {
		if(
			this.state.licensetype == "license"
		) {
			this.setState({
				licensevalue: valueType,
				licenselabel: label,
			},()=>{this.update(),this.modalTypeCancel()});
		} else if (
			this.state.licensetype == "type"
		) {
			this.setState({
				typevalue: valueType,
				typelabel: label
			},()=>{this.update(),this.modalTypeCancel()});
		};

	};

	submit = _ => {

		let obj = { assignworkid,username,tasknum,engineer:this.state.engineer };

		//console.log(obj,leftOut);
		Api.post('workorder/turnWorkOrder',obj)
			.then(res => {
				if (res.errorCode == 0) {
					Native.alert('success',() => this.props.history.goBack());
				} else {
					Native.alert(res.errorMsg);
				};
			});
	};

	upC = () => {
		this.props.form.validateFields((error, value) => {
			if (!error) {
				let condition = {};

				if ( value.username != '') {
					value.username = value.username.toUpperCase();
				};

				if ( value.teamname != '') {
					value.teamname = value.teamname.toUpperCase();
				};

				condition = {...value};

				this.setState({
					modalType:false,
					condition,
				}, this.update );
			}
		});
	};

	select=(id,name)=>{
		const {array}=this.state;

		this.setState({
			selected:id,
			dataSource:this.dataSource.cloneWithRows(array),
			engineer:name
		});

		//console.log(id);
	};

	handleTabClick = _ => {
		//console.log('onTabClick', _);
		this.setState({
			activeKey:_
		})
	};

	callback = _ => {
		//console.log(_);
	};

	//  时间变化
	dateChange = _ => {
		console.log(_);
	};

	rows= obj =>{
		//console.log(obj);
		const { selected }=this.state;
		return(
			<div className="tabs people">
				<div className="people-group" >
					<h2 className="font26">{obj[0].TEAMS}</h2>
					<div className="skill-group">
						<p className="skill-title">
							ENGINEER
						</p>

						{
							obj.map( (s,v) => {
								return (
									<div
										className={
											`skill-people ${ selected === s.ENGINEER?'selected':'default'}`
										}
										key = {v}

										onClick={ ()=> this.select(s.ENGINEER,s.SYSUSER) }
									>
										<div className="skill-info">
											<p>{ s.SYSUSER }</p>
											<span className="skill-head"></span>
											<span className="skill-select"></span>
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	};

	render(){
		let {
			selectDay,data,modalType,licensevalue,typevalue,licenselabel,typelabel,licensetype
		} = this.state;

		const { getFieldProps } = this.props.form;

		const {
			dataSource,
			rollingState,hasMore,refreshing
		} = this.state;

		return (
			<Content
				style={{background:'#f5f5f9',paddingTop:"1.2rem"}}
			>
				<Header title="Select Engineer">
					<div className="icon icon-condition" style={{right:0}} onClick={this.toggle}>

					</div>
				</Header>

				{/*<TimeChoice fn={this.dateChange}/>*/}

				<div className="manual-details newView" style={{padding:'0 .3rem'}}>
					{
						!dataSource?<ActivityIndicator />:
							<div className="manualSelect-list">
								<ListViewComponent
									dataSource={dataSource}
									hasMore={hasMore}
									rollingState={rollingState}
									rows={this.rows}
									refreshing={refreshing}
									//onScroll={this.onScroll}
									style={{
										height: '86vh'
									}}
									onRefresh={ this.onRefresh }
									//onEndReached = { this.onEndReached }
								/>
							</div>
					}

				</div>

				<Footer onClick={this.submit}>
					Submit{ selectDay == 0?null:`(${selectDay})`}
				</Footer>

				<Modal
					prefixCls={`criteria-warp am-modal`}
					visible={modalType}
					transparent
					onClose={ this.modalTypeCancel }
					className="modalSelect"
				>
					<div className="from-input">
						<from className="submit">

							<label className="group-input">
								<span>Team Name</span>
								<input className={`uppercase`} style={{paddingLeft:'1.5rem'}} type="text" {...getFieldProps('teamname',{
									initialValue:''
								})}/>
							</label>

							<label className="group-input">
								<span>User Name</span>
								<input className={`uppercase`} style={{paddingLeft:'1.5rem'}} type="text" {...getFieldProps('username',{
									initialValue:''
								})}/>
							</label>

							<div className="group-button">
								<div className="button red" onClick={ this.upC }>
									Submit
								</div>
							</div>
						</from>
					</div>

				</Modal>
			</Content>
		)
	}
};

EngineerSelection = createForm()(EngineerSelection);
export default EngineerSelection;