import '../details.less';

import React,{Component} from 'react';
import { Modal,ActivityIndicator,DatePicker,ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';



class MelOne extends Component {
	constructor(props){
		super(props);
		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		this.state = {
			dataSource:true,
			data:[],
			dpValue:zhNow,
			array:[],
			condition:{}
		};
		this.url = 'mel/findFileList';
	}

	componentDidMount(){
		this.update();
	}

	componentWillUnmount(){
		// this.setState = _ => {};
	};

	update = () => {
		let {condition} = this.state;
		condition.pageNow = 1
		return Api.post(this.url, condition)
			.then(res => {
				if (res.errorCode == 0) {
					this.setState({
						dataSource: false,
						data: res.pageInfo.pageData
					})
				} else {
					this.setState({
						dataSource: false,
					})
				}
			})
	};

	modalType = _ => {
		this.setState({
			modalType: true
		});
	};
	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType: false
		});
	};

	dateChange = _ => {
		this.setState({dpValue: _});
	};

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			setTimeout(() => {
				if (!error) {
					let condition = {};
					condition = {...value};
					this.setState({
						modalType: false,
						condition
					});
					this.update()
				}
			}, 500)
		});
	};

	render(){
		const {
			modalType,dataSource,data
		} = this.state;
		const { getFieldProps } = this.props.form;

		const listlist = data.length ? data.map((s, v) => {
			return (
				<Link
					to={{
						pathname: '/melDetails',
						search: `${s.MELID}`
					}}
					key={v}
				>
					<div className="list">
						<div className="list-top">
							<ul className="c666">MELNO：</ul>
							<ul className="c333">{s.MELNO}</ul>
						</div>
						<div className=" list-top">
							<ul className="c666">CREATEDBY：</ul>
							<ul className="c333">{s.CREATEDBY}</ul>
						</div>
						<div className="list-top">
							<ul className="c666">ACTYPE：</ul>
							<ul className="c333">{s.ACTYPE}</ul>
						</div>
						<div className="list-top">
							<ul className="c666">PARSINGMAN：</ul>
							<ul className="c333">{s.XMLWHEN}</ul>
						</div>
						<div className="list-top">
							<ul className="c666">CREATEDDATE：</ul>
							<ul className="c333">{s.CREATEDWHEN}</ul>
						</div>
						<div className="list-top">
							<ul className="c666">XMLDATE：</ul>
							<ul className="c333">{s.XMLDATE}</ul>
						</div>
					</div>
				</Link>
			)
		}) : '';
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="MEL"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div className="manual-details newView">
					{
						dataSource?<ActivityIndicator />:
							<div className="manualSelect-list">
								{listlist}
							</div>
					}

				</div>

				<Modal
					visible={modalType}
					// popup = {false}
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					title={`Criteria`}
				>
					<div className="from-input">
						<from className="submit">
							<div className="group-input" >
								<span>MELNO</span>
								<input  type="text" {...getFieldProps('MELNo',{
									initialValue:''
								})}/>
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


MelOne = createForm()(MelOne);
export default MelOne;