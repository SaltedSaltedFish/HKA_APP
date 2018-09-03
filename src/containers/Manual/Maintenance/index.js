
import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Flex,Modal,Radio,DatePicker } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewTest from '../../../components/ListViewTest';
import DatePickerChildren from '../../../components/DatePickerChildren';

import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';
import { manualMain } from '../../../actions/manual';


class Maintenance extends Component {
	constructor(props){
		super(props);
		console.log(props);
		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		let DATA = props.reduxData?props.reduxData:null;
		this.state = {
			modalType:false,
			modalCat:false,
			isRequest:true,

			dpValue:zhNow,

			upListView:true,

			condition:{},

			DATA,
		};

		this.url = 'maintenance/list';
	}

	componentWillMount(){

	};

	componentDidMount(){

	};

	componentWillUnmount(){
		this.setState = _ => {};
	};

	reduxAction = (obj) => {
		this.props.dispatch(manualMain({...obj}));
	};

	rows = (s,v) => {
		return (
			<Link
				to={{
					pathname:'/maintenance_details',
					search:s.tipid
				}}
				key={v}
			>
				<div className="list">
					<div className="list-top">
						ACTYPE：{s.actype}
						{/*<span>OPEN</span>*/}
						&nbsp;&nbsp;
						ATA：{s.ata}
					</div>
					<p className="list-describe">
						{s.fileno}
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

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			value.duedate = value.duedate == ''?'':TimeConversion.TIME(value.duedate);
			console.log(value);
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
			modalType,upListView,condition,DATA
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="MAINTENANCE"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div className="manual-details newView">
					<div className="manualSelect-list">
						<ListViewTest
							data={DATA}
							rows={ this.rows }
							url={ this.url }
							update={ upListView }
							condition={ condition }
							action={this.reduxAction}
							method={`post`}
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

							<label>
								<div className="group-input">
									<span>ATA</span>
									<input type="text" {...getFieldProps('ata',{
										initialValue:DATA?DATA.condition.ata:''
									})}/>
								</div>
							</label>

							<label>
								<div className="group-input">
									<span>ACREG</span>
									<input type="text" {...getFieldProps('acreg',{
										initialValue:DATA?DATA.condition.acreg:''
									})}/>
								</div>
							</label>

							<label>
								<div className="group-input">
									<span>FileNo</span>
									<input type="text" {...getFieldProps('fileno',{
										initialValue:DATA?DATA.condition.fileno:''
									})}/>
								</div>
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


Maintenance = createForm()(Maintenance);
Maintenance = connect(state =>{return {reduxData:state.ManualAMM.main}})(Maintenance);
export default Maintenance;