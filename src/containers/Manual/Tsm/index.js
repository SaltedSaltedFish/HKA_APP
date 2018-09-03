
import React,{Component} from 'react';
import { connect} from 'react-redux';
import { Modal,ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewTest from '../../../components/ListViewTest';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';
import { manualIPC } from "../../../actions/manual";

class Tsm extends Component {
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
		this.url = 'tsm/findTaskList';
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
		return (
			<Link
				to={{
					pathname:'/tsmdetails',
					search:`${s.ID}`
				}}
				key={v}
			>
				<div className="list">
					<div className="list-top">
						FAULTCODE ：{s.FAULTCODE}
					</div>
					<div className="list-top">
						SOURCE ：{s.SOURCE}
					</div>
					<div className="list-top">
						ATA ：{s.ATA}
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
			update:false
		});
	};
	modalTypeCancel = _ => {
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
					title="TSM"
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


							<label className="group-input">
								<span>ATA</span>
								<input
									// style={{paddingLeft:'2rem'}}
									type="text" {...getFieldProps('ata',{
									initialValue:''
								})}/>
							</label>

							<label className="group-input">
								<span>FAULTCODE</span>
								<input
									style={{paddingLeft:'2rem'}}
									type="text" {...getFieldProps('faultcode',{
									initialValue:''
								})}/>
							</label>

							<label className="group-input">
								<span>TASKINFO</span>
								<input
									style={{paddingLeft:'2rem'}}
									type="text" {...getFieldProps('taskinfo',{
									initialValue:''
								})}/>
							</label>

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


Tsm = createForm()(Tsm);
Tsm = connect(state => ({state:state.ManualAMM.tsm}))(Tsm);
export default Tsm;