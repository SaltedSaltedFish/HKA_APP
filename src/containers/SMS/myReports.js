import './index.less';

import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import { Modal,List,Radio,ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';
import { Criteria } from '../../containers/WorkOrderManage/WorkCondition';
import { ListViewComponentEx1 } from '../../components/ListViewTest';

import Api from '../../api/request';
import * as sms from '../../actions/sms';

const RadioItem = Radio.RadioItem;

class MyReports extends Component {
	constructor(props){
		super(props);

		//console.log(props);

		let condition = {

		};

		let taskData = [];
		let statusDate = [];

		this.state = {
			condition,
			update:true,
			showModal:false,

			typeValue:{value:'',label:'All'},
			typeModal:false,
			taskData,

			statusValue:{value:'',label:'All'},
			statusModal:false,
			statusDate,
		};

		this.url = 'smsraise/myreport';
		this.typeUrl = 'smsraise/listReportType';
		this.statusUrl = 'smsraise/listStuts';
	};

	componentWillMount(){

	};

	componentDidMount(){
		Api.post(this.typeUrl,{})
			.then(res => {
				console.log(res);
				this.setState({
					taskData:res.data || []
				})
			})

		Api.post(this.statusUrl,{})
			.then(res => {
				console.log(res);
				this.setState({
					statusDate:res.data || []
				})
			})
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	actions = (obj) => {
		//this.props.dispatch( sms.dis(sms.MyC,{name:'如果再相遇',age:'20'}));
		this.props.dispatch(sms.dis(sms.MyC,{...obj}));
	};

	toggle = () => {
		this.setState({
			showModal:!this.state.showModal,
			update:false,
		});
	};

	onChange = (e,value,modal) => {
		e.preventDefault();

		this.state[modal] = false;

		if ( modal == 'typeModal' ) {

			this.setState({
				typeValue:value
			});

			return;
		};

		this.setState({
			statusValue:value
		});
	};

	submit = () => {

		this.props.form.validateFields((error, value) => {
			console.log(error,value);

			let { condition } = this.state;

			if ( value.status != '' ) {
				value.status = value.status.toUpperCase();
			};

			value.reporttype = this.state.typeValue.value;
			value.status = this.state.statusValue.value;

			condition = {
				...value,
			};

			this.setState({
				condition,
				showModal:false,
				update:true,
			});
		});
	};

	// rows = s => {
	// 	// Description of Hazard
	// 	//  Event Subject
	// 	return (
	// 		<Link
	// 			to={{
	// 				pathname:'reports_details',
	// 				state:s
	// 			}}
	// 		>
	// 			<div className="list">
	// 				<div className="list-top">
	// 					<p>Event Subject：{s.subject}</p>
	// 					Ref No：{s.refno}
	// 					{/*<span>OPEN</span>*/}
	// 					&nbsp;&nbsp;
	// 					Report Type：{s.reporttype}
	// 					<span className={s.status}>{s.status}</span>
	// 				</div>
	// 				<p className="list-describe">
	// 					{s.eventdetails}
	// 				</p>
	// 			</div>
	// 		</Link>
	// 	)
	// };

	rows = s => {
		return (
			<div className="list">
				<div className="list-top">
					<p>Event Subject：{s.subject}</p>
					Ref No：{s.refno}
					{/*<span>OPEN</span>*/}
					&nbsp;&nbsp;
					Report Type：{s.reporttype}
					<span className={s.status}>{s.status}</span>
				</div>
				<p className="list-describe">
					{s.eventdetails}
				</p>
			</div>
		)
	};

	render(){
		const {
			condition,showModal,update
		} = this.state;

		const { getFieldProps } = this.props.form;

		return (
			<Content
				style={{paddingBottom:0}}
				className={`criteria-warp`}
			>
				<Header title="My Reports">

					<div className="icon icon-condition" style={{right:0}} onClick={this.toggle}>

					</div>
				</Header>

				<Modal
					transparent
					visible={ showModal }
					prefixCls={`criteria-warp am-modal`}
				>
					<div className="from-input">
						<from className="submit">
							<label className="group-input" onClick={ (e) => {
								e.preventDefault();
								this.setState({statusModal:true})
							}}>
								<div className="icon icon-list-"></div>
								<span>Status</span>
								<input
									className={`disabled`}
									disabled
									type="text" {...getFieldProps('status',{
									initialValue:this.state.statusValue.label
								})}/>
							</label>
							<label className="group-input" onClick={ (e) => {
								e.preventDefault();
								this.setState({typeModal:true})
							}}>
								<div className="icon icon-list-"></div>
								<span>Report Type</span>
								<input
									type="text"
									disabled
									className={`disabled`}
									style={{paddingLeft:'1.5rem'}}
									{...getFieldProps('reporttype',{
										initialValue:this.state.typeValue.label
									})}
								/>
							</label>

							<div className="group-button">
								<div className="button" style={{background:'#c83a36'}} onClick={this.submit}>
									Submit
								</div>
							</div>
						</from>
					</div>

				</Modal>

				<Modal
					visible={ this.state.typeModal }
					transparent
					className="modalSelect"
					onClose = { e => {
						e.preventDefault();
						this.setState({
							typeModal:false
						})
					}}
				>
					<List>
						{
							this.state.taskData.length == 0?
								<ActivityIndicator />:
								this.state.taskData.map((s,v) =>
									s?
										<RadioItem
											key={ s.value }
											checked={ this.state.typeValue.value === s.value }
											onChange={ e => this.onChange(e,s,'typeModal')}
										>
											{ s.label }
										</RadioItem>:null
							)
						}
					</List>

				</Modal>

				<Modal
					visible={ this.state.statusModal }
					transparent
					className="modalSelect"
					onClose = { e => {
						e.preventDefault();
						this.setState({
							statusModal:false
						})
					}}
				>
					<List>
						{
							this.state.statusDate.length == 0?
								<ActivityIndicator />:
								this.state.statusDate.map((s,v) =>
									s?
										<RadioItem
											key={ s.value }
											checked={ this.state.statusValue.value === s.value }
											onChange={ e => this.onChange(e,s,'statusModal') }
										>
											{ s.label }
										</RadioItem>:null
								)
						}
					</List>

				</Modal>

				<div className="manualSelect-list" style={{padding:'.3rem'}}>

					<ListViewComponentEx1
						rows={ this.rows }
						url={ this.url }
						update={ update }
						condition={ condition }
					/>

				</div>

			</Content>
		)
	};
};

MyReports = connect(
	state => ({
		reduxState:state.smsStore
	})
)(MyReports);
MyReports = createForm()(MyReports);
export default MyReports;