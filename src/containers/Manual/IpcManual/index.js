import '../details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import { Modal,ActivityIndicator,DatePicker,ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import ListViewTest from '../../../components/ListViewTest';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';
import { manualIPC } from "../../../actions/manual";

class Ipc extends Component {
	constructor(props){
		super(props);

		const zhNow = moment(TimeConversion.date()).locale('zh-cn').utcOffset(8);
		let DATA = props.state?props.state:null;
		let cache = props.location.state?props.location.state.cache:false;
		let show = !cache;
		this.state = {

			dpValue:zhNow,
			array:[],
			condition:{},

			update:true,
			DATA,
			cache,  //  回退不请求数据
			show,
			modalType:!show, //  筛选项
		};

		// this.acreg = props.location.search.replace('?acreg','');
		this.url = 'ipc/findIPCList';
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
	}

	componentWillMount(){

	};
	componentDidMount(){

	}

	componentWillUnmount(){
		this.setState = _ => {};
	};

	actions = (obj) => {
		this.props.dispatch(manualIPC({
			...obj,
			modalType:false
		}));
	};

	rows=(s,v)=>{
		const { condition } = this.state;
		return (
			<Link
				to={{
					pathname:'/ipcDetails',
					search:`${s.KEY}&&${condition.partnumber?condition.partnumber:''}&&${condition.acreg?condition.acreg:''}`
				}}
				key={v}
			>
				<div className="list">
					<div className="list-top">
						<ul className="c666">FIGURES：</ul><ul className="c333">{s.FIGURES}</ul>
					</div>
					<div className="list-describe list-top">
						<ul className="c666">TITLE：</ul><ul className="c333">{s.TITLE}</ul>
					</div>
					<div className="list-top" >
						<ul className="c666">ATA：</ul><ul className="c333">{s.ATA}</ul>
					</div>
					{/*<div className="list-top" > 后端给不了数据*/}
						{/*<ul className="c666">ACREG：</ul><ul className="c333">{s.ACREG}</ul>*/}
					{/*</div>*/}
					{/*<div className="list-top" >*/}
						{/*<ul className="c666">PARTNO：</ul><ul className="c333">{s.PARTNO}</ul>*/}
					{/*</div>*/}
					<div className="list-top" >
						<ul className="c666">APPLICABILITY：</ul><ul className="c333">{s.APPLICABILITY}</ul>
					</div>
					<div className="list-top">
						<ul className="c666">DMCODE：</ul><ul className="c333">{s.DMCODE}</ul>
					</div>
					<div className="list-top">
						<ul className="c666">ZONE：</ul><ul className="c333">{s.ZONE}</ul>
					</div>
				</div>
			</Link>
		)
	};

	modalType = _ => {
		this.setState({
			modalType:true,
			update:false
		});
	};
	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType:false,
			update:false
		});
	};

	dateChange = _ => {
		this.setState({ dpValue: _ });
	};

	submit = _ => {
		this.props.form.validateFields((error, value) => {
			if (!error) {

				let values = Object.entries(value);
				let vLenght = values.length;
				let counter = vLenght;
				let condition = {};

				values.map( s => {
					if ( s[1] == 0) {
						counter --
					};
				});

				if ( counter == 0 ) {
					Modal.alert('Must fill in a criteria');
					return;
				};

				condition = {...value};

				this.setState({
					modalType:false,
					condition,
					update:true,
					show:true
				});
			}
		});
	};

	render(){
		const {
			modalType,dataSource,
			condition,update,DATA,cache,show
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="IPC MANUAL"
				>
					<div className="icon icon-filter" onClick={ this.modalType }></div>
				</Header>
				{
					show?
						<div className="manual-details newView">
							<div className="manualSelect-list">
								<ListViewTest
									data={DATA}
									rows={ this.rows }
									url={ this.url }
									condition={ condition }
									update={ update }
									action={ this.actions }
									cache={ cache }
								/>
							</div>
						</div>:<div className="noData hasPadding">Please enter the criteria</div>
				}

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
							<label className="group-input" >
								<span>ATA</span>
								<input type="text" {...getFieldProps('ata',{
									initialValue:'',
								})}/>
							</label>

							{/*<label className="group-input" >*/}
								{/*<span>ACREG</span>*/}
								{/*<input type="text" {...getFieldProps('acreg',{*/}
									{/*initialValue:'',*/}
								{/*})}/>*/}
							{/*</label>*/}

							<label className="group-input">
								<span>Figure</span>
								<input type="text" {...getFieldProps('figures',{
									initialValue:'',
								})}/>
							</label>

							{/*<label className="group-input">*/}
								{/*<span>PARTNO</span>*/}
								{/*<input type="text" {...getFieldProps('partnumber',{*/}
									{/*initialValue:'',*/}
								{/*})}/>*/}

							{/*</label>*/}



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


Ipc = createForm()(Ipc);
Ipc = connect(state => ({state:state.ManualAMM.ipc}))(Ipc);
export default Ipc;