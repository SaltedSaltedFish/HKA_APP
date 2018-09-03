import './index.less';
import React,{Component} from 'react';
import { DatePicker,Modal,List,Radio } from 'antd-mobile';
import {createForm} from 'rc-form';
import moment from 'moment';

import { TaskState } from '../../../data';

import DatePickerChildren from '../../../components/DatePickerChildren';
import { TimeCHOICE } from '../../../components/TimeChoice';

import TimeConversion from '../../../utils/TimeConversion';

const RadioItem = Radio.RadioItem;

class WorkCondition extends Component {
	constructor(props){
		super(props);
		//console.log(props);
		let zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		this.state = {
			dpValue:zhNow,
			dpValue1:zhNow,

			taskModal:false,
			taskValue:{value:'',label:'All'},
			taskData:TaskState,
			assigndate:props.condition.assigndate?props.condition.assigndate:TimeConversion.date()
		};
	};

	//  时间变化
	dateChange = _ => {
		this.setState({ dpValue: _ });
	};

	//  时间变化1
	dateChange1 = _ => {
		this.setState({ dpValue1: _ });
	};

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			const { taskValue } = this.state;
			//console.log(value);
			value.taskState = taskValue.value;
			this.props.toggle();
			this.props.fn(value);
		});
	};

	modalType = e => {
		e.preventDefault();
		this.setState({
			taskModal:true
		});
	};

	modalTypeCancel = _ => {
		this.setState({
			taskModal:false
		});
	};

	onChange = (e,taskValue) => {
		e.preventDefault();
		this.setState({
			taskValue,
			taskModal:false
		});
	};

	updateTime = (obj) => {
		//console.log(obj);
		this.setState({
			assigndate:obj.nowDate
		})
	};

	render(){
		const { getFieldProps } = this.props.form;
		const {
			taskModal,taskValue,taskData,assigndate
		} = this.state;
		const { condition,type } = this.props;
		return (
			<div className="work-condition">
				{
					type?
						<div className="from-input">
							<from className="submit">
								<label>
									<div className="group-input">
										<span>TaskNum</span>
										<input type="text" {...getFieldProps('tasknum',{
											initialValue:condition.tasknum?condition.tasknum:''
										})}/>
									</div>
								</label>

								<label
									onClick={e => this.modalType(e)}
								>
									<div
										className="group-input"
									>
										<div className="icon icon-list-"></div>
										<span>State</span>
										<input
											className="disabled"
											disabled
											type="text" {...getFieldProps('taskState',{
											initialValue:taskValue.label
										})}/>
									</div>
								</label>

								<label>
									<div className="group-input">
										<span>Acreg</span>
										<input type="text" {...getFieldProps('acreg',{
											initialValue:condition.acreg?condition.acreg:''
										})}/>
									</div>
								</label>

								<label>
									<div className="group-input">
										<span>Flight No.</span>
										<input type="text" {...getFieldProps('flightnum',{
											initialValue:condition.flightnum?condition.flightnum:''
										})}/>
									</div>
								</label>

								<div className="group-button">
									<div className="button" style={{background:'#c83a36'}} onClick={this.submit}>
										Submit
									</div>
								</div>
							</from>
						</div>
						:
						<div className="from-input">
							<from className="submit">
								<label>
									<div className="group-input">
										<span>TaskNum</span>
										<input type="text" {...getFieldProps('tasknum',{
											initialValue:condition.tasknum?condition.tasknum:''
										})}/>
									</div>
								</label>

								{/*<div className="group-input">*/}
								{/*<span>工包號</span>*/}
								{/*<input type="text" {...getFieldProps('woid',{*/}
								{/*initialValue:''*/}
								{/*})}/>*/}
								{/*</div>*/}

								<label
									onClick={e => this.modalType(e)}
								>
									<div
										className="group-input"
									>
										<div className="icon icon-list-"></div>
										<span>State</span>
										<input
											className="disabled"
											disabled
											type="text" {...getFieldProps('taskState',{
											initialValue:taskValue.label
										})}/>
									</div>
								</label>
								<label className="group-input">
									<span>Assign Date</span>
									<TimeCHOICE nowDate = {assigndate} fn={this.updateTime}/>
									<input type="text" hidden {...getFieldProps('assigndate',{
										initialValue:assigndate
									})}/>
								</label>
								<label>
									<div className="group-input">
										<span>Acreg</span>
										<input type="text" {...getFieldProps('acreg',{
											initialValue:condition.acreg?condition.acreg:''
										})}/>
									</div>
								</label>

								<label>
									<div className="group-input">
										<span>Flight No.</span>
										<input type="text" {...getFieldProps('flightnum',{
											initialValue:condition.flightnum?condition.flightnum:''
										})}/>
									</div>
								</label>

								<label className="group-input">
									<span>EngineerUser</span>
									<input
										type="text"
										style={{
											paddingLeft:'1.5rem'
										}}
										{...getFieldProps('engineerUser',{
											initialValue:condition.EngineerUser?condition.EngineerUser:''
										})}/>
								</label>

								{/*<div className="group-input">*/}
								{/*<p>描述</p>*/}
								{/*<textarea*/}
								{/*cols="30"*/}
								{/*rows="10"*/}
								{/*maxLength={1000}*/}
								{/*style={{*/}
								{/*width:'100%',*/}
								{/*height:'1rem'*/}
								{/*}}*/}
								{/*{...getFieldProps('feedbacknote')}*/}
								{/*></textarea>*/}
								{/*</div>*/}

								{/*<div className="group-input">*/}
								{/*<span>Duedate</span>*/}
								{/*<DatePicker*/}
								{/*mode="date"*/}
								{/*extra=""*/}
								{/*value = {dpValue}*/}
								{/*onChange={_ => this.dateChange(_)}*/}
								{/*{...getFieldProps('duedate',{*/}
								{/*initialValue:dpValue,*/}
								{/*rules: [{ required: true}]*/}
								{/*})}*/}
								{/*>*/}
								{/*<DatePickerChildren></DatePickerChildren>*/}
								{/*</DatePicker>*/}
								{/*</div>*/}

								{/*<div className="group-input">*/}
								{/*<span>AccomplishDate</span>*/}
								{/*<DatePicker*/}
								{/*mode="date"*/}
								{/*extra=""*/}
								{/*value = {dpValue1}*/}
								{/*onChange={_ => this.dateChange1(_)}*/}
								{/*{...getFieldProps('accomplishtime',{*/}
								{/*initialValue:dpValue1,*/}
								{/*rules: [{ required: true}]*/}
								{/*})}*/}
								{/*>*/}
								{/*<DatePickerChildren></DatePickerChildren>*/}
								{/*</DatePicker>*/}
								{/*</div>*/}

								<div className="group-button">
									<div className="button" style={{background:'#c83a36'}} onClick={this.submit}>
										Submit
									</div>
								</div>
							</from>
						</div>
				}

				<Modal
					visible={ taskModal }
					transparent
					onClose={ this.modalTypeCancel }
					className="modalSelect"
				>
					<List>
						{
							taskData.map((s,v) =>
								s?
									<RadioItem
										key={ s.value }
										checked={ taskValue.value === s.value }
										onChange={ e => this.onChange(e,s)}
									>
										{ s.label }
									</RadioItem>:null
							)
						}
					</List>

				</Modal>
			</div>
		)
	}
};

WorkCondition = createForm()(WorkCondition);
export default WorkCondition;