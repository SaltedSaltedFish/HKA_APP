import './details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Flex,Modal,Radio,DatePicker } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../components/Header';
import Content from '../../components/Content';
import ListViewTest from '../../components/ListViewTest';
import DatePickerChildren from '../../components/DatePickerChildren';

import TimeConversion from '../../utils/TimeConversion';
import moment from 'moment';
import { manualADD } from '../../actions/manual';
import Native from "../../utils/Native";

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;

class ManualSBList extends Component {
	constructor(props){
		super(props);
		console.log(props);
		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		let DATA = props.reduxData?props.reduxData:null;
		this.state = {
			modalType:false,
			modalCat:false,
			valueType:'A320',
			valueCat:'A',
			isRequest:true,

			dpValue:'',
			dpValueend:'',

			upListView:true,

			condition:{},

			DATA,
		};

		this.url = 'add/getAddList';
	}

	componentWillMount(){

	};

	componentDidMount(){

	};

	componentWillUnmount(){
		this.setState = _ => {};
	};

	reduxAction = (obj) => {
		this.props.dispatch(manualADD({...obj}));
	};

	rows = (s,v) => {
		return (
			<Link
				to={{
					pathname:'/manual_menuADD',
					search:s.addid
				}}
			>
				<div className="list">
					<div className="list-top">
						ACREG：{s.acreg}
						{/*<span>OPEN</span>*/}
						&nbsp;&nbsp;
						ADD No.{s.addNo}
						<span className={s.state}>{s.state}</span>
					</div>
					<div className="list-top">
						DUE DATE：{s.duedate?TimeConversion.TIME(s.duedate):''}
					</div>
					<p className="list-describe">
						LIMITATION:&nbsp;&nbsp;{s.punishment}
					</p>
					<p className="list-describe">
						{s.defectDesc}
					</p>
				</div>
			</Link>
		)
	};
	modalType = _ => {
		this.setState({
			modalType:true,
			upListView:false
		});
	};
	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType:false,
			upListView:false
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
			console.log(value);
			value.duedate1 = value.duedate1 == ''?'':TimeConversion.TIME(value.duedate1);
			value.duedate2 = value.duedate2 == ''?'':TimeConversion.TIME(value.duedate2);
			if (value.duedate1 != '' && value.duedate2 != '') {
				let startTime = TimeConversion.getTime(value.duedate1);
				let endTime = TimeConversion.getTime(value.duedate2);
				if (startTime > endTime) {
					console.log('时间选择错误');
					Native.alert('Time selection error');
					return;
				}
				;
			}
			;
			if (!error) {
				let condition = {};
				condition = {...value};
				this.setState({
					modalType:false,
					condition,
					upListView:true
				});
			}
		});
	};

	render(){
		const {
			modalType,upListView,condition,DATA,dpValueend,dpValue
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="ADD"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div className="manual-details newView">
					<div className="manualSelect-list">
						<ListViewTest
							data={ DATA }
							rows={ this.rows }
							url={ this.url }
							update={ upListView }
							condition={ condition }
							action={this.reduxAction}
							cache={this.props.location.state}
							method={`get`}
						/>
					</div>
				</div>

				<Modal
					prefixCls={`criteria-warp am-modal`}
					visible={modalType}
					popup = {false}
					transparent
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					style={{width:'90%'}}
					//title={`Criteria`}
				>
					<div className="from-input">
						<from className="submit">

							{/*<label>*/}
								{/*<div className="group-input">*/}
									{/*<span>ATA</span>*/}
									{/*<input type="text" {...getFieldProps('ata',{*/}
										{/*initialValue:DATA?DATA.condition.ata:''*/}
									{/*})}/>*/}
								{/*</div>*/}
							{/*</label>*/}

							<label>
								<div className="group-input">
									<span>Acreg</span>
									<input type="text" {...getFieldProps('acreg',{
										initialValue:DATA?DATA.condition.acreg:''
									})}/>
								</div>
							</label>

							<label>
								<div className="group-input">
									<span>ADD No.</span>
									<input type="text" {...getFieldProps('addno',{
										initialValue:DATA?DATA.condition.addno:''
									})}/>
								</div>
							</label>

							<label>
								<div className="group-input">
									<span>Limitation</span>
									<input type="text" {...getFieldProps('punishment',{
										initialValue:DATA?DATA.condition.punishment:''
									})}/>
								</div>
							</label>
							<label>
								<div className="group-input">
									<span>Description</span>
									<input type="text" {...getFieldProps('defectdesc',{
										initialValue:DATA?DATA.condition.defectdesc:''
									})}/>
								</div>
							</label>

							<div>
								<p style={{marginTop:'.2rem'}}>Due Date Between</p>
								<div className="group-input modify">
									<span>Start</span>
									<DatePicker
										mode="date"
										extra=""
										value = {dpValue}
										onChange={_ => this.dateChange(_)}
										{...getFieldProps('duedate1',{
											initialValue:DATA?DATA.condition.duedate1:''
										})}
									>
										<DatePickerChildren
											style={{
												lineHeight:'inherit',
												width:'65%',
												paddingLeft:'2rem'
											}}
										/>
									</DatePicker>
								</div>
								<div className="group-input modify">
									<span>End</span>
									<DatePicker
										mode="date"
										extra=""
										value = {dpValueend}
										onChange={_ => this.dateendChange(_)}
										{...getFieldProps('duedate2',{
											initialValue:DATA?DATA.condition.duedate2:''
										})}
									>
										<DatePickerChildren
											style={{
												lineHeight:'inherit',
												width:'65%',
												paddingLeft:'2rem'
											}}
										/>
									</DatePicker>
								</div>
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


ManualSBList = createForm()(ManualSBList);
ManualSBList = connect(state =>{return {
	reduxData:state.ManualAMM.add
}})(ManualSBList);
export default ManualSBList;