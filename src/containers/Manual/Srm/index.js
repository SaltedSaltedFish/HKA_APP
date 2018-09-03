
import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewTest from '../../../components/ListViewTest';
import { manualSrm } from "../../../actions/manual";

class SRM extends Component {
	constructor(props){
		super(props);
		let DATA = props.reduxData?props.reduxData:null;
		this.state = {
			modalType:false,
			modalCat:false,
			isRequest:true,
			upListView:true,
			condition:{},
			DATA,
		};

		this.url = `srm/findTaskList`;
	}

	componentWillMount(){

	};

	componentDidMount(){

	};

	reduxAction = (obj) => {
		this.props.dispatch(manualSrm({...obj}));
	};

	componentWillUnmount(){
		this.setState = _ => {};
	};

	rows = (s,v) => {
		return (
			<Link
				to={{
					pathname:'/srm_details',
					search:'?' + JSON.stringify(s)
				}}
			>
				<div key={v} className="list">
					<div className="list-top">
						RN:{s.RN}
						&nbsp;&nbsp;
						ATA：{s.ATA}
					</div>
					<p className="list-describe">
						{s.TITLE}
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

	submit = _ => {
		this.props.form.validateFields((error, value) => {
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
					title="SRM"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div className="manual-details newView">
					<div className="manualSelect-list">
						<ListViewTest
							data={DATA}
							key={`SBVIEW`}
							rows={ this.rows }
							url={ this.url }
							update={ upListView }
							condition={ condition }
							cache={this.props.location.state}
							action={this.reduxAction}
							method={`post`}
						/>
					</div>
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
							<div className="group-input">
								<span>ATA</span>
								<input type="text" {...getFieldProps('ata',{
									initialValue:''
								})}/>
							</div>

							<div className="group-input">
								<p
									style={{
										textAlign:'left'
									}}
								>
									TaskInfo
								</p>
								<textarea
									cols="30"
									rows="10"
									{...getFieldProps('taskinfo',{
										initialValue:''
									})}
								></textarea>
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

function reduxState (state) {
	return {
		reduxData:state.ManualAMM.srm
	}
};

SRM = createForm()(SRM);
SRM = connect(reduxState)(SRM);
export default SRM;