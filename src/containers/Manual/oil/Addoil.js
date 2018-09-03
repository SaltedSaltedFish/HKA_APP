import '../details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import { Modal,ActivityIndicator,DatePicker,ListView ,Toast} from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';


class Addoil extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:[],
			condition:{},
			onchange:null
		};
		this.url = 'tlb/save';
	}

	componentWillMount(){
		let { condition } = this.state;
		const acreglpnum = this.props.location.search.replace('?','');
		let al=acreglpnum.split("&&");
		if(al.length==2) {
			this.setState({
            title:"MODIFY OIL"
			})
			condition.ACREG = al[0];
			condition.LPNUM = al[1];

			Api.post("tlb/load", condition)
				.then(res => {

					if (res.errorCode == "0") {
						this.setState({
							data: res.data
						})
					}

				})
		}else {
			this.setState({
				title:"ADD OIL"
			})
		}
	};

	componentDidMount(){
		console.log(this.refs.lv);
	}

	componentWillUnmount(){
		this.setState = _ => {};
	};

	update = _ => {
		let { condition } = this.state;
		return Api.post(this.url,condition)
			.then(res => {
					Toast.info(res.errorMsg,2,null,false)

			})
	};


	dateChange = _ => {
		this.setState({ dpValue: _ });
	};

	onChange=(e)=>{
		setTimeout(()=>{
		this.props.form.validateFields((error, value) => {
				Api.post("tlb/load", {
					"ACREG": value.ACREG,
					"LPNUM": value.LPNUM
				}).then(res => {
					if(res.errorCode=="0") {
						this.setState({
							onchange: res.data
						})

					}
				})
		})
		},500)
	}

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			if (!error) {
				let condition = {};
				condition = {...value};
				this.setState({
					modalType:false,
					condition
				},()=>{this.update()});

			}
		});
	};
	render(){
		const {
			data ,title,onchange
		} = this.state;
		const { getFieldProps,validateFields } = this.props.form;

		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title={title}
				>
				</Header>
					<div className="from-input" style={{padding:'0.3rem',background:'#F5F5F5'}}>
						<from className="submit">
							<div className="group-input">
								<span>ACREG</span>
								<input  disabled={title=="MODIFY OIL"} type="text" {...getFieldProps('ACREG',{
									initialValue:[data.ACREG],
									onChange: this.onChange
								})}/>
							</div>
							<div className="group-input">
								<span>LPNUM</span>
								<input  disabled={title=="MODIFY OIL"} type="text"  {...getFieldProps('LPNUM',{
									initialValue:[data.LPNUM],
									onChange: this.onChange

								})}/>
							</div>
							{onchange?<div style={{color:'#C83A36',fontSize:'0.1rem'}}>This LPNUMHE and the ACREG related data have already existed if the submission will be covered</div>:null}
							<div className="group-input">
								<span>FLIGHTNUMBER</span>
								<input style={{paddingLeft:'2rem'}} type="text" {...getFieldProps('FLIGHTNUMBER',{
									initialValue:[data.FLIGHTNUMBER],
								})}/>
							</div>
							{/*<div className="group-input">*/}
								{/*<span>DEPARTURE DATE</span>*/}
								{/*<DatePicker*/}
									{/*mode="date"*/}
									{/*extra=""*/}
									{/*value = {dpValue}*/}
									{/*onChange={_ => this.dateChange(_)}*/}
									{/*{...getFieldProps('DEPARTUREDATE',{*/}
										{/*initialValue:dpValue,*/}
										{/*rules: [{ required: true}]*/}
									{/*}	)}*/}
								{/*>*/}
									{/*<DatePickerChildren></DatePickerChildren>*/}
								{/*</DatePicker>*/}
							{/*</div>*/}

							{/*<div className="group-input">*/}
								{/*<span>FLT</span>*/}
								{/*<input type="text" {...getFieldProps('arrstn',{*/}
									{/*initialValue:''*/}
								{/*})}/>*/}
							{/*</div>*/}

							{/*<div className="group-input" style={{marginBottom:'0.4rem'}}>*/}
								{/*<span>LP</span>*/}
								{/*<input type="text" {...getFieldProps('flightno',{*/}
									{/*initialValue:''*/}
								{/*})}/>*/}
							{/*</div>*/}
							<div className="oiltil">ENG UPLIFT</div>
							<div className="blgroup-input">
								<input type="text" {...getFieldProps('ENG1',{
									initialValue:[data.ENG1],
								})}/>
							</div>
							<div className="brgroup-input">
								<input type="text" {...getFieldProps('ENG2',{
									initialValue:[data.ENG2],
								})}/>
							</div>
							<div className="oiltil">IDG UPLIFT</div>
							<div className="blgroup-input">
								<input type="text" {...getFieldProps('IDG1',{
									initialValue:[data.IDG1],
								})}/>
							</div>
							<div className="brgroup-input">
								<input type="text" {...getFieldProps('IDG2',{
									initialValue:[data.IDG2],
								})}/>
							</div>
							<div className="blgroup-input">
								<input type="text" {...getFieldProps('IDG3',{
									initialValue:[data.IDG3],
								})}/>
							</div>
							<div className="brgroup-input">
								<input type="text" {...getFieldProps('IDG4',{
									initialValue:[data.IDG4],
								})}/>
							</div>

							<div className="oiltil">APU UPLIFT</div>
							{/*<div className="group-input"  style={{marginBottom:'0.4rem'}}>*/}
								{/*<input style={{paddingLeft:'0'}} type="text" {...getFieldProps('APU',{*/}
									{/*initialValue:''*/}
								{/*})}/>*/}
							{/*</div>*/}
							<div className="tgroup-input">
								<input type="text" {...getFieldProps('APU',{
									initialValue:[data.APU],
								})}/>
							</div>
							<div className="tgroup-input">
								<input type="text" {...getFieldProps('APUFH',{
									initialValue:[data.APUFH],
								})}/>
							</div>
							<div className="tgroup-input">
								<input type="text" {...getFieldProps('APUFC',{
									initialValue:[data.APUFC],
								})}/>
							</div>

							<div  className="oiltil">HYD UPLIFT</div>
							<div className="tgroup-input">
								<input type="text" {...getFieldProps('HYDG',{
									initialValue:[data.HYDG],
								})}/>
							</div>
							<div className="tgroup-input">
								<input type="text" {...getFieldProps('HYDB',{
									initialValue:[data.HYDB],
								})}/>
							</div>
							<div className="tgroup-input">
								<input type="text" {...getFieldProps('HYDY',{
									initialValue:[data.HYDY],
								})}/>
							</div>

							<div className="oiltil">ENG ARR QTY</div>
							<div className="blgroup-input">
								<input type="text" {...getFieldProps('ENGARR1',{
									initialValue:[data.ENGARR1],
								})}/>
							</div>
							<div className="brgroup-input">
								<input type="text" {...getFieldProps('ENGARR2',{
									initialValue:[data.ENGARR2],
								})}/>
							</div>

							<div className="oiltil">ENG DEP QTY</div>
							<div className="blgroup-input">
								<input type="text" {...getFieldProps('ENGDEP1',{
									initialValue:[data.ENGDEP1],
								})}/>
							</div>
							<div className="brgroup-input" style={{marginBottom:'0.6rem'}}>
								<input type="text" {...getFieldProps('ENGDEP2',{
									initialValue:[data.ENGDEP2],
								})}/>
							</div>

							<div className="group-button">
								<div className="button" onClick={this.submit}>
									Submit
								</div>
							</div>
						</from>
					</div>
			</Content>
		)
	}
}


Addoil = createForm()(Addoil);
export default Addoil;