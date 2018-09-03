
import React,{Component} from 'react';
import {Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewTest from '../../../components/ListViewTest';

class SRMDetails extends Component {
	constructor(props){
		super(props);
		let condition = JSON.parse(props.location.search.replace('?',''));
		let param = {};
		param.taskId = condition.ID;
		param.type = condition.RN;
		this.state = {
			modalType:false,
			modalCat:false,
			isRequest:true,
			upListView:true,
			param,
		};

		this.url = `srm/findPossibleReason`;
	}

	componentWillMount(){

	};

	componentDidMount(){

	};

	componentWillUnmount(){
		this.setState = _ => {};
	};

	rows = (s,v) => {
		return (
			<div className="list">
				<p
					className="list-describe"
					style={{
						borderTop:'0'
					}}
					dangerouslySetInnerHTML={{__html:s.CONTENT}}
				>

				</p>
			</div>
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
			upListView:true
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
			modalType,upListView,param
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="SRM DETAILS"
				>

				</Header>
				<div className="manual-details newView">
					<div className="manualSelect-list">
						<ListViewTest
							key={`SBVIEW`}
							rows={ this.rows }
							url={ this.url }
							update={ upListView }
							condition={ param }
							cache={this.props.location.state}
							method={`post`}
						/>
					</div>
				</div>
				<Modal
					visible={modalType}
					popup = {false}
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					title={`Criteria`}
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

SRMDetails = createForm()(SRMDetails);
export default SRMDetails;