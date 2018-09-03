import './index.css';

import React,{Component} from 'react';
import { createForm } from 'rc-form';
import {
	DatePicker,
	Modal,List,
	Radio,Checkbox,
	ActivityIndicator,
	ListView
} from 'antd-mobile';
import moment from 'moment';

import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import Native from "../../../utils/Native";

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import DatePickerChildren from '../../../components/DatePickerChildren';

import { ACTYPE } from '../../../data';

const RadioItem = Radio.RadioItem;
const CheckboxItem = Checkbox.CheckboxItem;

const padding = {
	paddingLeft: '1.7rem'
};


const DivLabel = props => (
	<div
		className="group-input"
		onClick={ props.onClick?e=>props.onClick(e):null }
	>
		<label>
			{props.children}
		</label>
	</div>
);

class AddTask extends Component {
    constructor(props){
        super(props);
		//console.log(props);

		/*默认属性*/
		let data = props.location.state || {};

		let AcValue = {
			value:data.actype || '',
			label:data.actype || ''
		};

		let ArValue = {
			ACREG:data.acreg || '',
		};

		console.log(AcValue);
		/*end*/
		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		let Reference = props.location.search.replace('?reference=','');
		let condition = Reference == ''?false:props.location.state;

		this.state = {
			dpValue:zhNow,
			Reference,

			FinModal:false,
			FinValue:{CODE:'',FINALSKILL:''},
			FinData:[],

			RecModal:false,
			RecValue:{CODE:'',ACTION:''},
			RecData:[],

			AcModal:false,
			AcValue,
			AcData:ACTYPE,

			ArModal:false,
			ArValue,
			ArData:[],

			CardModal:false,
			CardValue:{REFERENCE:Reference},
			CardData:[],

			dataSource:false,

			condition   // 带过来的条件
		};

        this.url = 'nrc/add';
        this.getFinalskillUrl = 'nrc/getFinalskill';
        this.getRecommendedActionUrl = 'nrc/getRecommendedAction';
        this.acreg = 'nrc/acreg/list';
        this.reference = 'nrc/reference/list';

        this.Recarray = new Set();
	    this.RecarrayName = new Set();
	    this.RecarrayInput = '';

	    this.Finarray = new Set();
	    this.FinarrayName = new Set();
	    this.FinarrayInput = '';

	    this.dataSource = new ListView.DataSource({
		    rowHasChanged: (row1, row2) => row1 !== row2,
	    });
    };

    componentWillMount(){

	}

    componentDidMount(){
	    /**
	     * @param A/c reg 由nrc/acreg/list 获取
	     * @param A/c type 现在只有三种 A320 A330 A350
	     * @param Reference 由nrc/getReference 获取
	     * @param CARD Referennce 由nrc/reference/list获取 如果是根据AMS就只有唯一
	     * */
	    const { AcValue } = this.state;

	    Api.post(this.getFinalskillUrl,{})
		    .then(res => {
			    //console.log(res)
			    if (res.errorCode == 0) {
				    this.setState({
					    FinData:res.data.finalskillList
				    })
			    }
		    });

	    Api.post(this.getRecommendedActionUrl,{})
		    .then(res => {
			    //console.log(res)
			    if (res.errorCode == 0) {
				    this.setState({
					    RecData:res.data.recommendedActionList
				    })
			    }
		    });

	    if (AcValue.value != '') {
		    Api.post(this.acreg,{actype:AcValue.value})
			    .then(res => {
				    if ( res.errorCode == 0 ) {
					    this.setState({
						    ArData:res.data.acreglist
					    });
				    }
			    })
	    };
    };

	//  时间变化
	dateChange = dpValue => {
		this.setState({ dpValue });
	};
	//	弹窗
	modalType = e => {
		e.preventDefault();
		this.setState({
			FinModal:true
		});
	};
	modalTypeCancel = _ => {
		this.FinarrayInput = '';
		for (let item of this.FinarrayName.values()) {
			this.FinarrayInput += item +','
		};
		this.setState({
			FinModal:false
		});
	};
	onChange = (e,FinValue) => {
		e.preventDefault();
		if ( this.Finarray.has(FinValue.CODE) ) {
			this.FinarrayName.delete(FinValue.FINALSKILL);
			this.Finarray.delete(FinValue.CODE);
		} else {
			this.FinarrayName.add(FinValue.FINALSKILL);
			this.Finarray.add(FinValue.CODE);
		}
	};

	modalType1 = e => {
		e.preventDefault();
		this.setState({
			RecModal:true
		});
	};
	modalTypeCancel1 = _ => {
		this.RecarrayInput = '';
		for (let item of this.RecarrayName.values()) {
			this.RecarrayInput += item +','
		};

		this.setState({
			RecModal:false
		});
	};
	onChange1 = (e,RecValue) => {
		e.preventDefault();
		if ( this.Recarray.has(RecValue.CODE) ) {
			this.RecarrayName.delete(RecValue.ACTION);
			this.Recarray.delete(RecValue.CODE);
		} else {
			this.RecarrayName.add(RecValue.ACTION);
			this.Recarray.add(RecValue.CODE);
		}
	};

	modalType2 = e => {
		e.preventDefault();
		this.setState({
			AcModal:true
		});
	};
	modalTypeCancel2 = _ => {
		this.setState({
			AcModal:false
		});
	};
	onChange2 = (e,AcValue) => {
		e.preventDefault();
		this.setState({
			AcValue,
			AcModal:false,
			ArValue:{ACREG:''}
		});

		Api.post(this.acreg,{actype:AcValue.value})
			.then(res => {
				//console.log(res);
				if ( res.errorCode == 0 ) {
					this.setState({
						ArData:res.data.acreglist
					});
				}
			})
	};

	modalType3 = e => {
		e.preventDefault();
		this.setState({
			ArModal:true
		});
	};

	modalTypeCancel3 = _ => {
		this.setState({
			ArModal:false
		});
	};

	onChange3 = (e,ArValue) => {
		e.preventDefault();
		const { Reference } = this.state;
		this.setState({
			ArValue,
			ArModal:false
		});

		//return;
		Reference == ''?
		Api.post(this.reference,{acreg:ArValue.ACREG})
			.then(res => {
				//console.log(res);
				if ( res.errorCode == 0 ) {
					this.setState({
						CardData:res.data.acreglist,
						dataSource:this.dataSource.cloneWithRows(res.data.acreglist)
					});
				}
			}):null;
	};

	modalType4 = e => {
		//console.log(2);
		e.preventDefault();
		this.setState({
			CardModal:true,
		});
	};
	modalTypeCancel4 = _ => {
		this.setState({
			CardModal:false,
			dataSource:this.dataSource.cloneWithRows(this.state.CardData)
		});
	};
	onChange4 = (e,CardValue) => {
		e.preventDefault();
		this.setState({
			CardValue,
			CardModal:false,
			dataSource:this.dataSource.cloneWithRows(this.state.CardData)
		});
	};

	mul = (set) => {
		let string0 = '';
		for (let item of set.values()) {
			string0 += item +',';
		};
		string0 = string0.split(',');
		let string = '';
		string0.map((s,v)=>{
			if (v <= set.size -2) {
				string += s+' ';
			} else if (v <= set.size -1 ) {
				string += s
			}
		});

		return string;
	};


    submit = _ => {
    	const { FinValue,RecValue } = this.state;
        this.props.form.validateFields((error, value) => {
			value.time = TimeConversion.TIME(value.time._d);
			let finalskill = '',recommendedaction = '';

	        finalskill = this.mul(this.Finarray);
	        recommendedaction = this.mul(this.Recarray);
	        // for (let item of this.Finarray.values()) {
		     //    finalskill += item +' ';
	        // };
	        // for (let item of this.Recarray.values()) {
		     //    recommendedaction += item +' ';
	        // };

	        //console.log(finalskill,recommendedaction);
			value.finalskill = finalskill;
			value.recommendedaction = recommendedaction;
			value.reference?null:value.reference = '';
			Api.post(this.url,value)
				.then(res=>{
					if(res.errorCode == 0) {
						Native.alert('Success',()=>this.props.history.goBack());
					} else {
						Native.alert('error');
					}
				})
        });
    };

    rows = (s) => {
        return (
	        <RadioItem
		        key={ s.REFERENCE }
		        checked={ this.state.CardValue.REFERENCE === s.REFERENCE }
		        onChange={ e => this.onChange4(e,s)}
	        >
		        { s.REFERENCE }
	        </RadioItem>
        )
    };

    render(){
        const { getFieldProps } = this.props.form;
        const { dpValue,Reference,
			FinModal,FinValue,FinData,
			RecModal,RecValue,RecData,
			AcModal,AcValue,AcData,
			ArModal,ArValue,ArData,
			CardModal,CardValue,
	        dataSource,
	        condition
        } = this.state;
        return (
			<Content
				style={{
					paddingBottom:0
				}}
			>
				<Header title="NRC"/>

				<div className="from-input" style={{padding:'.3rem'}}>
					<from className="submit">
						<DivLabel className="group-input">
							<span>NRCSN</span>
							<input type="text" {...getFieldProps('nrcsn',{
								initialValue:''
							})}/>
						</DivLabel>

						<DivLabel className="group-input">
							<span>CUSTOMER</span>
							<input
								type="text"
								{...getFieldProps('customer',{
									initialValue:''
								})}
								style={{...padding}}
							/>
						</DivLabel>

						<DivLabel
							className="group-input"
							onClick={ e => this.modalType2(e) }
						>
							<div className="icon icon-list-"></div>
							<span>A/C TYPE</span>
							<input
								className="disabled"
								disabled
								type="text" {...getFieldProps('actype',{
								initialValue:AcValue.label
							})}/>
						</DivLabel>

						<DivLabel
							className="group-input"
							onClick={ e => this.modalType3(e) }
						>
							<div className="icon icon-list-"></div>
							<span>A/C REG</span>
							<input
								className="disabled"
								disabled
								type="text" {...getFieldProps('acreg',{
								initialValue:ArValue.ACREG
							})}/>
						</DivLabel>

						<DivLabel className="group-input">
							<span>CHECKTYPE</span>
							<input
								type="text"
								{...getFieldProps('checktype')}
								style={{...padding}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>ZONE</span>
							<input type="text" {...getFieldProps('zone',{
								initialValue:condition?condition.zone:''
							})}/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>ATA</span>
							<input type="text" {...getFieldProps('ata',{
								initialValue:' '
							})}/>
						</DivLabel>

						<DivLabel className="group-input">
							<span>RAISEDDATE</span>
							<DatePicker
								mode="date"
								extra=""
								value = {dpValue}
								onChange={_ => this.dateChange(_)}
								{...getFieldProps('time',{
									initialValue:dpValue,
									rules: [{ required: true}]
								})}
							>
								<DatePickerChildren style={{...padding}}></DatePickerChildren>
							</DatePicker>
							{/*<TimeCHOICE*/}
								{/*fn={this.updateTime}*/}
								{/*getFieldProps={()=> {return {...getFieldProps('raiseddate',{*/}
									{/*initialValue:this.state.dpValue,*/}
								{/*})}}}*/}
							{/*/>*/}
						</DivLabel>
						<DivLabel className="group-input">
							<span>BARCODENO</span>
							<input
								type="text"
								{...getFieldProps('barcodeno',{
									initialValue:''
								})}
								style={{...padding}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>ORIGINATINGMPITEM</span>
							<input
								type="text"
								{...getFieldProps('originatingmpitem',{
									initialValue:''
								})}
								style={{paddingLeft:'2.7rem'}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>DEFERRALNO</span>
							<input
								type="text"
								{...getFieldProps('deferralno',{
									initialValue:''
								})}
								style={{...padding}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>TOTALMHRS</span>
							<input type="text" {...getFieldProps('totalmhrs',{
								initialValue:''
							})}
							style={{...padding}}
							/>
						</DivLabel>
						{/*----------------------------------------------------------*/}
						<div className="group-input"
							onClick={(e) => this.modalType(e)}
						>
							<label>
								<div className="icon icon-list-"></div>
								<span>FINALSKILL</span>
								<input
									className="disabled"
									type="text"
									{...getFieldProps('finalskill',{
										initialValue:this.FinarrayInput,
									})}
									style={{
										paddingLeft:'1.7rem'
									}}
									disabled
								/>
							</label>
						</div>

						<DivLabel className="group-input">
							<p>DEFECTSDESCRIPTION</p>
							<textarea
								cols="30"
								rows="10"
								{...getFieldProps('defectsdescription',{
									initialValue:''
								})}
							></textarea>
						</DivLabel>
						<DivLabel className="group-input">
							<span>WRITTENBY</span>
							<input type="text" {...getFieldProps('writtenby',{
								initialValue:''
							})}
							style={{...padding}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>PERFORMDATE</span>
							<input type="text" {...getFieldProps('performdate',{
								initialValue:''
							})}
						   	style={{paddingLeft:'2rem'}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>CWSREFERENCE</span>
							<input type="text" {...getFieldProps('cwsreference',{
								initialValue:''
							})}
						   	style={{paddingLeft:'2.2rem'}}
							/>
						</DivLabel>
						{/*------------------------------------------------------------*/}
						<div className="group-input"
							onClick={e => this.modalType1(e)}
						>
							<label>
								<div className="icon icon-list-"></div>
								<span>RECOMMENDEDACTION</span>
								<input
									type="text"
									{...getFieldProps('recommendedaction',{
										initialValue:this.RecarrayInput
									})}
									className="disabled"
									disabled
							   		style={{paddingLeft:'3rem'}}
								/>
							</label>
						</div>
						<DivLabel className="group-input">
							<p>RECTIFICATION</p>
							<textarea
								cols="30"
								rows="10"
								{...getFieldProps('rectification',{
									initialValue:''
								})}
							></textarea>
						</DivLabel>
						<DivLabel className="group-input">
							<span>SIGNATURE</span>
							<input type="text" {...getFieldProps('signature',{
								initialValue:''
							})}
							style={{...padding}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>AUTHORIZATIONNO</span>
							<input type="text" {...getFieldProps('authorizationno',{
								initialValue:''
							})}
							style={{paddingLeft:'2.5rem'}}
							/>
						</DivLabel>
						<DivLabel className="group-input">
							<span>Date</span>
							<input type="text" {...getFieldProps('date',{
								initialValue:''
							})}/>
						</DivLabel>
						{/*{*/}
							{/*Reference ==''?*/}
								{/*null:*/}
								{/*<DivLabel*/}
									{/*className="group-input"*/}
								{/*>*/}
									{/*<span>CARD REFERENCE</span>*/}
									{/*<input*/}
										{/*className="disabled"*/}
										{/*disabled*/}
										{/*type="text" {...getFieldProps('reference',{*/}
										{/*initialValue:CardValue.REFERENCE*/}
									{/*})}*/}
										{/*style={{paddingLeft:'2.5rem'}}*/}
									{/*/>*/}
								{/*</DivLabel>*/}
						{/*}*/}
						{
							Reference == ''?
								<DivLabel
									className="group-input"
									onClick={e => this.modalType4(e)}
								>
									<div className="icon icon-list-"></div>
									<span>CARD REFERENCE</span>
									<input
										className="disabled"
										disabled
										type="text" {...getFieldProps('reference',{
										initialValue:CardValue.REFERENCE
									})}
										style={{paddingLeft:'2.5rem'}}
									/>
								</DivLabel>:
								<DivLabel
									className="group-input"
								>
									<span>CARD REFERENCE</span>
									<input
										className="disabled"
										disabled
										type="text" {...getFieldProps('reference',{
										initialValue:CardValue.REFERENCE
									})}
										style={{paddingLeft:'2.5rem'}}
									/>
								</DivLabel>
						}

						<div className="group-button">
							<div className="button" onClick={this.submit}>
								Submit
							</div>
						</div>
					</from>
				</div>


				<Modal
					visible={FinModal}
					transparent
					onClose={this.modalTypeCancel}
					className="modalSelect"
				>
					<List>
						{
							FinData.length>0?FinData.map((s,v) =>
								<CheckboxItem
									key={s.CODE}
									onChange={(e) => this.onChange(e,s)}
								>
									{s.FINALSKILL}
								</CheckboxItem >
							): <ActivityIndicator />
						}
					</List>
				</Modal>

				<Modal
					visible={RecModal}
					transparent
					onClose={this.modalTypeCancel1}
					className="modalSelect"
				>
					<List>
						{
							RecData.length>0?RecData.map((s,v) =>
								<CheckboxItem
									key={s.CODE}
									onChange={(e) => this.onChange1(e,s)}
								>
									{s.ACTION}
								</CheckboxItem>
							): <ActivityIndicator />
						}
					</List>
				</Modal>

				<Modal
					visible={AcModal}
					transparent
					onClose={this.modalTypeCancel2}
					className="modalSelect"
				>
					<List>
						{
							AcData.map((s,v) =>
								<RadioItem
									key={s.value}
									checked={AcValue.value === s.value}
									onChange={(e) => this.onChange2(e,s)}
								>
									{s.label}
								</RadioItem>
							)
						}
					</List>
				</Modal>

				<Modal
					visible={ ArModal }
					transparent
					onClose={ this.modalTypeCancel3 }
					className="modalSelect"
				>
					<List>
						{
							ArData.length > 0?ArData.map(s =>
								<RadioItem
									key={s.ACREG}
									checked={ArValue.ACREG === s.ACREG}
									onChange={(e) => this.onChange3(e,s)}
								>
									{s.ACREG}
								</RadioItem>
							):<ActivityIndicator />
						}
					</List>
				</Modal>

				<Modal
					visible={ CardModal }
					transparent
					onClose={ this.modalTypeCancel4 }
					className="modalSelect"
				>
					{/*<List>*/}
						{/*{*/}
							{/*CardData.length > 0?CardData.map((s,v) =>*/}
								{/*s?*/}
								{/*<RadioItem*/}
									{/*key={ s.REFERENCE }*/}
									{/*checked={ CardValue.REFERENCE === s.REFERENCE }*/}
									{/*onChange={ e => this.onChange4(e,s)}*/}
								{/*>*/}
									{/*{ s.REFERENCE }*/}
								{/*</RadioItem>:null*/}
							{/*):<ActivityIndicator />*/}
						{/*}*/}
					{/*</List>*/}
					{
						dataSource?
							<ListView
								style={{
									height:'5rem'
								}}
								dataSource={dataSource}
								renderRow={this.rows}
								initialListSize={10}
								pageSize={10}
								scrollRenderAheadDistance={200}
								scrollEventThrottle={20}
							/>:null
					}
				</Modal>
			</Content>
        )
    }
}
AddTask = createForm()(AddTask);
export default AddTask