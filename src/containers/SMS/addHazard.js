import './index.less';

import React,{ Component } from 'react';
import { createForm } from 'rc-form';
import { DatePicker,Modal,List,Radio,ActivityIndicator } from 'antd-mobile';

import Api from '../../api/request';
import Native from '../../utils/Native';

import Header from '../../components/Header';
import Content from '../../components/Content';

const RadioItem = Radio.RadioItem;

class ADDHazard extends Component {

	constructor(props){

		super(props);
		let fileNum = [];
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

			sevModal:false,
			sevValue:{DESCRIPTION:'',RS_ID:''},
			sevData:[],

			likeModal:false,
			likeValue:{DESCRIPTION:'',RL_ID:''},
			likeData:[],

			staModal:false,
			staValue:{value:'',label:'All'},

			load:false,
		};

		this.counter = 4;
		this.url = 'smsraise/raiseHazard';
		this.sev = 'smsraise/listSeverity'; //  获取后果严重性
		this.like = 'smsraise/listLikelihood';  //获取后果可能性

		this.updateList1 = false;
		this.updateList2 = false;

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

	};

	componentDidMount(){
		Api.post(this.sev,{})
			.then(res => {
				if (res.errorCode == 0) {
					//console.log(res);
					this.updateList1 = true;
					this.state.sevData = res.data;
					this.loadList({sevData:res.data});
				}
			});

		Api.post(this.like,{})
			.then(res => {
				if (res.errorCode == 0) {
					//console.log(res);
					this.updateList2 = true;
					this.state.likeData = res.data;
					this.loadList({likeData:res.data});
				}
			});
	};

	componentWillUnmount(){
		this.setState = () => {};
	}

	loadList = (obj) => {
		//console.log(obj);
		if (this.updateList1 && this.updateList2) {
			this.setState({...obj})
		}
	};

	submit = _ => {
		this.props.form.validateFields((error, value) => {

			//console.log(error,value);
			if(!error) {

				this.setState({
					load:true,
				});

				const { fileNum,addArray,sevValue,likeValue,staValue } = this.state;
				let array = [];
				array.push(...fileNum);
				array.push(...addArray);

				array.map((s,v) =>
					value[`file${v+1}`] = s.file
				);

				if (likeValue.RL_ID == '' || sevValue.RS_ID == '') {
					Modal.alert('Likelihood and Severity is Required');
					console.log('Likelihood和Severity为必填项');
					return;
				};

				value.likelihood = likeValue.RL_ID;
				value.severity = sevValue.RS_ID;
				//value.status = staValue.value;

				//console.log(value);

				Api.post(this.url,value)
					.then(res => {

						this.setState({
							load:false,
						});

						if (res.errorCode == 0) {
							Native.alert('success',()=>this.props.history.goBack());
						} else {
							Modal.alert(res.errorMsg);
						};
					})
			} else {

				let array = [];
				for (let i in error) {
					array.push({...error[i].errors[0]});
				};
				console.log(array[0].message);
				Modal.alert(array[0].message);
			};
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

		this.setState({addArray});
	};

	reduceFile = (v) => {
		this.counter--;
		let { addArray } = this.state;
		addArray.splice(v,1);
		this.setState({ addArray });
	};

	modalType = e => {
		e.preventDefault();
		this.setState({
			sevModal:true
		});
	};
	modalTypeCancel = _ => {
		this.setState({
			sevModal:false
		});
	};
	radioChange = (e,sevValue) => {
		e.preventDefault();

		this.props.form.setFieldsValue({
			severity:sevValue.DESCRIPTION
		});

		this.setState({
			sevValue,
			sevModal:false
		});
	};

	modalType1 = e => {
		e.preventDefault();
		this.setState({
			likeModal:true
		});
	};
	modalTypeCancel1 = _ => {
		this.setState({
			likeModal:false
		});
	};
	radioChange1 = (e,likeValue) => {
		e.preventDefault();

		this.props.form.setFieldsValue({
			likelihood:likeValue.DESCRIPTION
		});

		this.setState({
			likeValue,
			likeModal:false
		});
	};

	render(){
		const { getFieldProps } = this.props.form;
		const { fileNum,addArray,
			sevModal,sevValue,sevData,
			likeModal,likeValue,likeData
		} = this.state;

		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="Raise Hazard "/>

				<div className="from-input modify" style={{padding:'.3rem'}}>

					<from className="submit">
						<label>
							<div className="group-input">
								<span>Description of Hazard</span>
								<input
									type="text"
									{...getFieldProps('eventsubject',{
										initialValue:'',
										rules: [{ required: true,message:'Description of Hazard is Required' }]
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
								<span>Associated Consequence</span>
								<textarea
									cols="30"
									rows="10"
									{...getFieldProps('eventdetails',{
										initialValue:'',
										rules: [{ required: true,message:'Associated Consequence is Required'}]
									})}
								></textarea>
							</div>
						</label>

						<label
							onClick={e => this.modalType(e)}
						>
							<div className="group-input" ref={`severity`}>
								<div className="icon icon-list-"></div>
								<span>Severity</span>
								<input
									type="text"
									className="disabled"
									disabled
									{...getFieldProps('severity',{
										initialValue:sevValue.DESCRIPTION,
										rules: [{ required: true,message:'Severity is Required'}]
									})}/>
							</div>
						</label>

						<label
							onClick={e => this.modalType1(e)}
						>
							<div className="group-input" ref={`likelihood`}>
								<div className="icon icon-list-"></div>
								<span>Likelihood</span>
								<input
									type="text"
									className="disabled"
									disabled
									{...getFieldProps('likelihood',{
										initialValue:likeValue.DESCRIPTION,
										rules: [{ required: true,message:'Likelihood is Required'}]
									})}/>
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
					visible={ sevModal }
					transparent
					onClose={ this.modalTypeCancel }
					className="modalSelect"
				>
					<List>
						{
							sevData.length == 0?
								<ActivityIndicator />:
								sevData.map((s,v)=>
									<RadioItem
										key={ s.RS_ID }
										checked={ sevValue.RS_ID === s.RS_ID }
										onChange={ e => this.radioChange(e,s)}
									>
										{ s.DESCRIPTION }
									</RadioItem>
							)
						}
					</List>
				</Modal>

				<Modal
					visible={ likeModal }
					transparent
					onClose={ this.modalTypeCancel1 }
					className="modalSelect"
				>
					<List>
						{
							likeData.length == 0?
								<ActivityIndicator />:
								likeData.map((s,v)=>
									<RadioItem
										key={ s.RL_ID }
										checked={ likeValue.RL_ID === s.RL_ID }
										onChange={ e => this.radioChange1(e,s)}
									>
										{ s.DESCRIPTION }
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


ADDHazard = createForm()(ADDHazard);
export default ADDHazard;