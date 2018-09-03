import '../details.less';

import React,{Component} from 'react';
import { Modal,ActivityIndicator,DatePicker,
	ListView,
	Radio,List,
	Checkbox
} from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewTest from '../../../components/ListViewTest';
import DatePickerChildren from '../../../components/DatePickerChildren';



import TimeConversion from '../../../utils/TimeConversion';
import Native from '../../../utils/Native';
import moment from 'moment';
import {manualTA} from "../../../actions/manual";
import {connect} from "react-redux";

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;

class TAList extends Component {
	constructor(props) {
		super(props);
		//const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		let DATA = props.reduxData?props.reduxData:null;
		this.state = {
			dpValueend: '',
			dpValue: '',
			condition: {},

			modalValue:{},

			cateModal:false,
			cateValue:{
				value:'',
				label:''
			},

			upListView:true,
			DATA,
		};

		this.url = 'ta/list';
		this.dataSource = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.inputArray = [
			{
				title:'TANO',
				value:'tano'
			}
		];

		this.category = [
			{
				value:'AD',
				label:'AD'
			},{
				value:'Operation/Maintenance nformation',
				label:'Operation/Maintenance nformation'
			},{
				value:'Maintenance/DispatchStandard',
				label:'Maintenance/DispatchStandard'
			},{
				value:'PartInformation',
				label:'PartInformation'
			},{
				value:'Others',
				label:'Others'
			}
		];

		this.catearray = new Set();
		this.catearrayName = new Set();
		this.catearrayInput = '';
	}


	componentWillMount(){

	};

	componentDidMount(){
		//console.log(this.refs.lv);
	}

	componentWillUnmount(){
		this.setState = _ => {};
	};

	reduxAction = (obj) => {
		this.props.dispatch(manualTA({...obj}));
	};

	rows = (s,v) => {
		return (
			<Link
				to={{
					pathname:'/ta_details',
					search:`${s.technicaladvisoryid}`
				}}
				key={s.technicaladvisoryid}
			>
				<div className="list">
					<div className="list-top">
						TANO：{s.tano}
						{/*<span>OPEN</span>*/}
						&nbsp;&nbsp;
						REVISION：{s.revision}
					</div>

					<div className="list-top">
						CATEGORY：{s.category}
					</div>
					<div className="list-top">
						EFFECTDATE：{TimeConversion.TIME(s.effectdate)}
					</div>
					<p className="list-describe">
						{s.subject}
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
			upListView:true
		});
	};

	dateChange = _ => {
		this.setState({ dpValue: _ });
	};

	dateendChange = _ => {
		this.setState({ dpValueend: _ });
	};

	modalType1 = e => {
		e.preventDefault();
		this.setState({
			cateModal:true
		});
	};
	modalTypeCancel1 = _ => {

		this.catearrayInput = '';
		let array = this.catearrayName;
		for (let item of array.values()) {
			this.catearrayInput += item +',';
		};
		this.catearrayInput = this.catearrayInput.split(',');
		let string = '';
		this.catearrayInput.map((s,v)=>{
			if (v <= array.size -2) {
				string += s+' ';
			} else if (v <= array.size -1 ) {
				string += s
			}
		});
		this.catearrayInput = string;
		this.setState({
			cateModal:false
		});
	};

	onChange = (e,cateValue) => {
		e.preventDefault();
		if ( this.catearray.has(cateValue.value) ) {
			this.catearrayName.delete(cateValue.label);
			this.catearray.delete(cateValue.value);
		} else {
			this.catearrayName.add(cateValue.label);
			this.catearray.add(cateValue.value);
		}
	};

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			value.effectdate1 = value.effectdate1._d?TimeConversion.TIME(value.effectdate1._d):'';
			value.effectdate2 = value.effectdate2._d?TimeConversion.TIME(value.effectdate2._d):'';
			//value.category = this.state.cateValue.value;

			if (value.effectdate1._d !='' && value.effectdate2._d != '') {
				let startTime = TimeConversion.getTime(value.effectdate1);
				let endTime = TimeConversion.getTime(value.effectdate2);
				if (startTime > endTime) {
					console.log('时间选择错误');
					Native.alert('Time selection error');
					return;
				};
			};
			if (!error) {
				let condition = {...value};
				this.setState({
					modalType:false,
					condition,
					upListView:true
				});
			};
		});
	};

	render(){
		const {
			modalType,
			upListView,condition,DATA,dpValue,dpValueend,
			cateModal,cateValue
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="TA"
				>
					<div
						className="icon icon-filter"
				        onClick={ this.modalType }
					>

					</div>
				</Header>
				<div className="manual-details newView">
					<div className="manualSelect-list">
						<ListViewTest
							data={DATA}
							rows={ this.rows }
							url={ this.url }
							cache={this.props.location.state}
							update={ upListView }
							condition={ condition }
							action={this.reduxAction}
							key={`TAVIEW`}
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

							{/*<label*/}

							{/*>*/}
								{/*<div*/}
									{/*className="group-input"*/}
								{/*>*/}
									{/*<span>ATA</span>*/}
									{/*<input*/}
										{/*style={{paddingLeft:'1rem'}}*/}
										{/*type="text" {...getFieldProps('ata',{*/}
										{/*initialValue:""*/}
									{/*})}/>*/}
								{/*</div>*/}
							{/*</label>*/}
							<label

							>
								<div
									className="group-input"
								>
									<span>SUBJECT</span>
									<input
										style={{paddingLeft:'1.3rem'}}
										type="text" {...getFieldProps('subject',{
										initialValue:""
									})}/>
								</div>
							</label>

							{
								this.inputArray.map(s =>
									<label key={s.title}>
										<div className="group-input">
											<span>{s.title}</span>
											<input type="text" {...getFieldProps(s.value,{
												initialValue:''
											})}/>
										</div>
									</label>
								)
							}

							<label

							>
								<div
									className="group-input"
									onClick={ e => this.modalType1(e)}
								>
									<div className="icon icon-list-"></div>
									<span>CATEGORY</span>
									<input
										className="disabled"
										disabled
										style={{paddingLeft:'1.5rem'}}
										type="text" {...getFieldProps('category',{
										initialValue:this.catearrayInput
									})}/>
								</div>
							</label>

							<div className="group-input">
								<span>STARTEFFECTDATE</span>
								<DatePicker
									mode="date"
									extra=""
									value = {dpValue}
									onChange={ _ => this.dateChange(_)}
									{...getFieldProps('effectdate1',{
										initialValue:dpValue
									})}
								>
									<DatePickerChildren />
								</DatePicker>
							</div>

							<div className="group-input">
								<span>ENDEFFECTDATE</span>
								<DatePicker
									mode="date"
									extra=""
									value = {dpValueend}
									onChange={ _ => this.dateendChange(_) }
									{...getFieldProps('effectdate2',{
										initialValue:dpValueend
									})}
								>
									<DatePickerChildren />
								</DatePicker>
							</div>

							<div className="group-button">
								<div className="button red" onClick={this.submit} >
									Submit
								</div>
							</div>
						</from>
					</div>
				</Modal>

				<Modal
					visible={cateModal}
					transparent
					onClose={this.modalTypeCancel1}
					style={{width:'95%'}}
					className="modalSelect"
				>
					<List>
						{
							this.category.length>0?this.category.map((s,v) =>
								<CheckboxItem
									key={s.value}
									onChange={(e) => this.onChange(e,s)}
								>
									{s.label}
								</CheckboxItem>
							): <ActivityIndicator />
						}
					</List>
				</Modal>
			</Content>
		)
	}
}


TAList = createForm()(TAList);
TAList = connect(state => {return {
	reduxData:state.ManualAMM.ta
}})(TAList);
export default TAList;