import './index.less';

import React,{ Component } from 'react';
import { createForm } from 'rc-form';
import { DatePicker,Modal,List,Radio,ActivityIndicator } from 'antd-mobile';
import moment from 'moment';

import TimeConversion from '../../utils/TimeConversion';
import Api from '../../api/request';
import Native from '../../utils/Native';

import Header from '../../components/Header';
import Content from '../../components/Content';
import DatePickerChildren from '../../components/DatePickerChildren';

const RadioItem = Radio.RadioItem;

class ADDIor extends Component {

	constructor(props){
		super(props);
		let fileNum = [];
		const dpValue = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);

		for (let i=1;i<4;i++) {
			fileNum.push({
				key:i,
				file:{},
				name:''
			});
		}

		this.state = {
			fileNum,
			addArray :[],
			dpValue,

			peoModal:false,
			peoValue:{value:'2',label:'否(NO)'},
			peoData:[
				{
					label:'是(YES)',
					value:'1'
				},{
					label:'否(NO)',
					value:'2'
				}
			],

			staModal:false,
			staValue:{value:'',label:'All'},

			load:false,
		};

		this.counter = 4;
		this.url = 'smsraise/raiseIOR';

		this.status = [
			{
				value:'',
				label:'All'
			},{
				value:'S',
				label:'Submitted',
			},{
				value:'I',
				label:'Investigating',
			},{
				value:'R',
				label:'Replied',
			},{
				value:'C',
				label:'Closed',
			}
		];
	}

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			if(!error) {

				this.setState({
					load:true,
				});

				const { fileNum,addArray,peoValue,staValue } = this.state;
				let array = [];

				array.push(...fileNum);
				array.push(...addArray);

				array.map((s,v) =>
					value[`file${v+1}`] = s.file
				);
				value.reportdate = TimeConversion.TIME(value.reportdate._d);
				value.injury = peoValue.value;

				if ( value.acreg != '') {
					value.acreg = value.acreg.toUpperCase();
				};

				//value.status = staValue.value;

				console.log(value);

				Api.post(this.url,value)
					.then(res => {

						this.setState({
							load:false,
						});

						if (res.errorCode == 0) {
							Native.alert('success',()=>this.props.history.goBack());
						} else {
							Native.alert(res.errorMsg);
						};
					})
			} else {
				let array = [];
				for (let i in error) {
					array.push({...error[i].errors[0]});
				};
				console.log(array[0].message);
				Modal.alert(array[0].message);
			}
		});
	};

	onChange = (obj,e) => {
		const { fileNum } = this.state;
		let file = e.target.files[0];
		let num = obj.key -1;
		//console.log(file);
		fileNum[num].file = file;
		fileNum[num].name = file.name;
		//console.log(fileNum,obj);
		this.setState({
			fileNum
		});
	};
	onChange1 = (e,v) => {
		const { addArray } = this.state;
		let file = e.target.files[0];
		let num = v;
		addArray[num].file = file;
		addArray[num].name = file.name;
		this.setState({
			addArray
		});
	};

	addFile = () => {
		console.log(this.counter);
		if ( this.counter > 10) {
			Modal.alert('The maximum value of the attachment is 10!');
			return;
		};

		this.counter++;
		const { addArray } = this.state;
		addArray.push({
			key:this.counter,
			file:{},
			name:''
		});

		this.setState({ addArray });
	};

	reduceFile = (v) => {
		this.counter--;
		let { addArray } = this.state;
		addArray.splice(v,1);
		this.setState({ addArray });
	};

	dateChange = dpValue => {
		this.setState({ dpValue });
	};

	modalType = e => {
		e.preventDefault();
		this.setState({
			peoModal:true
		});
	};
	modalTypeCancel = _ => {
		this.setState({
			peoModal:false
		});
	};

	radioChange = (e,peoValue) => {
		e.preventDefault();

		this.props.form.setFieldsValue({
			injury:peoValue.label
		});

		this.setState({
			peoValue,
			peoModal:false
		});
	};

	render(){
		const { getFieldProps } = this.props.form;
		const { fileNum,addArray,peoModal,peoValue,peoData,dpValue } = this.state;
		//console.log(fileNum);
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="Raise IOR"/>

				<div className="from-input modify" style={{padding:'.3rem'}}>

					<from className="submit">
						<label>
							<div className="group-input">
								<span>Subject</span>
								<input
									type="text"
									{...getFieldProps('eventsubject',{
										initialValue:'',
										rules: [{ required: true,message:'Event Subject is Required'}]
									})}/>
							</div>
						</label>

						{/*<label className="group-input"*/}
						       {/*onClick={e => {*/}
							       {/*e.preventDefault();*/}
							       {/*this.setState({staModal:true});*/}
						       {/*}}*/}
						{/*>*/}
							{/*<div className="icon icon-list-"></div>*/}
							{/*<span>Status</span>*/}
							{/*<input*/}
								{/*type="text"*/}
								{/*className="disabled"*/}
								{/*disabled*/}
								{/*{...getFieldProps('status',{*/}
									{/*initialValue:this.state.staValue.label*/}
								{/*})}/>*/}
						{/*</label>*/}

						<label>
							<div className="group-input">
								<span>Acreg</span>
								<input
									type="text"
									className={`uppercase`}
									{...getFieldProps('acreg',{
										initialValue:'',
										//rules: [{ required: true}]
									})}/>
							</div>
						</label>

						<label>
							<div className="group-input">
								<span>Location</span>
								<input
									type="text"
									{...getFieldProps('location',{
										initialValue:'',
										//rules: [{ required: true}]
									})}/>
							</div>
						</label>

						<div className="group-input">
							<span>Report Date</span>
							<DatePicker
								mode="date"
								extra=""
								value = {dpValue}
								onChange={_ => this.dateChange(_)}
								{...getFieldProps('reportdate',{
									initialValue:dpValue,
									rules: [{ required: true}]
								})}
							>
								<DatePickerChildren></DatePickerChildren>
							</DatePicker>
						</div>

						<label>
							<div className="group-input">
								<span>Flight No</span>
								<input
									type="text"
									{...getFieldProps('flightno',{
										initialValue:''
									})}/>
							</div>
						</label>

						<label
							onClick={e => this.modalType(e)}
						>
							<div className="group-input">
								<div className="icon icon-list-"></div>
								<span>Injury</span>
								<input
									type="text"
									className="disabled"
									disabled
									{...getFieldProps('injury',{
										initialValue:peoValue.label
									})}/>
							</div>
						</label>


						<label>
							<div className="group-input">
								<span>Event Details</span>
								<textarea
									cols="30"
									rows="10"
									{...getFieldProps('eventdetails',{
										initialValue:'',
										rules: [{ required: true,message:'Event Details is Required'}]
									})}
								></textarea>
							</div>
						</label>

						<label>
							<div className="group-input">
								<span>Phone</span>
								<input
									type="number"
									minLength={11}
									{...getFieldProps('contactphone',{
										initialValue:''
									})}/>
							</div>
						</label>

						<label>
							<div className="group-input">
								<span>Email</span>
								<input
									type="email"
									style={{
										width:'88%'
									}}
									{...getFieldProps('contactemail',{
										initialValue:'',
										rules:[{
											type:'email',
											message:'Email is not a valid email'
										}]
									})}/>
							</div>
						</label>

						{
							fileNum.map(s =>
								<label key={s.key}>
									<div className="group-input fileContainer">
										<span>{`Attachment${s.key}`}</span>
										<p className="fileName">{ s.name }</p>
										<input
											className="file"
											type="file"
											onChange={(e) => this.onChange(s,e)}
										/>
									</div>
								</label>
							)
						}

						{
							addArray.map((s,v) =>
								<label key={v+4}>
									<div className="group-input fileContainer">
										<span>{`Attachment${v+4}`}</span>
										<p className="fileName">{ s.name }</p>
										<input
											className="file"
											type="file"
											onChange={(e) => this.onChange1(e,v)}
										/>
										<i onClick={()=>this.reduceFile(v)}>-</i>
									</div>
								</label>
							)
						}

						<div
							className="AddFile"
							onClick={this.addFile}
						>
							+
						</div>

						<div className="group-button">
							<div className="button" onClick={this.submit}>
								Submit
							</div>
						</div>
					</from>
				</div>

				<Modal
					visible={ peoModal }
					transparent
					onClose={ this.modalTypeCancel }
					className="modalSelect"
				>
					<List>
						{
							peoData.map((s,v)=>
								<RadioItem
									key={ s.value }
									checked={ peoValue.value === s.value }
									onChange={ e => this.radioChange(e,s)}
								>
									{ s.label }
								</RadioItem>
							)
						}
					</List>
				</Modal>

				<Modal
					visible={ this.state.staModal }
					transparent
					onClose={ () => this.setState({staModal:false}) }
					className="modalSelect"
				>
					<List>
						{
							this.status.map((s,v)=>
								<RadioItem
									key={ s.value }
									checked={ this.state.staValue.value === s.value }
									onChange={ e => {
										e.preventDefault();
										this.setState({staValue:s,staModal:false});
									}}
								>
									{ s.label }
								</RadioItem>
							)
						}
					</List>
				</Modal>

				<ActivityIndicator
					toast
					text="Loading..."
					animating={ this.state.load }
				/>


			</Content>
		)
	}
};


ADDIor = createForm()(ADDIor);
export default ADDIor;