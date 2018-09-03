import './index.css';

import React,{Component} from 'react';
import { Flex ,Modal,List, InputItem,ActivityIndicator,Radio,Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import { Link } from 'react-router-dom';

import getState from '../../../utils/getState';
import FlightInfo from '../../../components/FlightInfo';
import Api from '../../../api/request';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import WorkListADMIN from '../../../components/WorkListADMIN';

const FlexItem = Flex.Item;
const alert = Modal.alert;
const prompt = Modal.prompt;
const RadioItem = Radio.RadioItem;


let set;
class WorkDetails extends Component {
	constructor(){
		super();
		this.state = {
			data:{},
			hours:false,
			moneyfocused:false,
			isRequest:true,

			modalType:false,
			valueType:'',
			fltid:'',
			engineer:'',
			modalData:[],

			visible:false,

			Reference:false
		};

		this.getReference = '/nrc/getReference';
	}

	componentWillMount(){
		const id = this.props.location.search.replace('?id=','');
		Api.get('workorder/getWorkOrderById',{assignworkid:id})
			.then(res => {
				let data;
				if (res.errorCode == 0) {
					data = res.data;
				} else {
					data = false;
				}

				this.setState({
					data,
					isRequest:false
				});

				return data;
			})
			.then(json => {
				json?
					Api.post(this.getReference,{tasknum:json.tasknum})
						.then(res=> {
							if(res.errorCode == 0) {

								let Reference = res.reference || res.data.reference || false;
								if (Reference) {
									this.setState({
										Reference
									})
								};
							}
						}):null
			})
	}

	componentWillUnmount(){
		clearTimeout(set);
		this.setState = _ => {};
	};

	render(){
		const {data,isRequest,Reference} = this.state;
		//const { modalType,valueType,modalData} = this.state;
		let state = getState.state(data?data.taskcompletion:'');
		const id = this.props.location.search.replace('?id=','');
		return (
			<Content
				style={{
					paddingBottom:0
				}}
			>
				<Header
					title={data?data.wono:''}
				>
				</Header>

				{
					Reference?
						<div className="transmit icon icon-task">
							<Link
								to={{
									pathname: '/add_task',
									search: `?reference=${Reference.REFERENCES}`,
									state:data
								}}
							/>
						</div>
						:null
				}

				{
					isRequest?<ActivityIndicator/>:
						!data?<div className="noData hasPadding">No Data</div>:
							<div>
								<div data-name="workDetailsAdmin">
									<div className="details-top">
										<div className="details-work">
											<WorkListADMIN data={data} pending={true}/>
										</div>
										<div className="details-relation">
											Associated FLT
										</div>
										<p
											style={{
												color:'white',
												textAlign:'center',
												padding:'.2rem .2rem 0'
											}}
										>{ data.flightnumx }</p>
										<FlightInfo data={data}/>
									</div>
									<div className="details-bottom">

										<div className="details-list">
											<Link

												to={{
													pathname: '/engineer_selection',
													search: id + "&" + data.tasknum + '&' + data.acreg + '&' + data.flightnumx
												}}

												style={{
													display:'block',
													overflow:'hidden'
												}}
											>
												<div className="list-title">
													Assigned To
												</div>
												<div className="list-info">
													<div>{data.performer}</div>
												</div>
											</Link>
										</div>
										<div className="details-list">
											<div className="list-title">
												MH
											</div>
											<div className="list-info">
												<div>{data.mh}</div>
											</div>
										</div>
										<div className="details-list" style={{borderBottom:0}}>
											<div className="list-title">
												Zone
											</div>
											<div className="list-info">
												<div>{data.zone}</div>
											</div>
										</div>

										<div className="details-description">
											<p className="list-color2">Job Card Description</p>
											<p
												dangerouslySetInnerHTML={{__html:data.jobcardDescription}}
											>
											</p>
										</div>

										<div className="details-list" style={{borderTop:0}}>
											<div className="list-title">
												Performer
											</div>
											<div className="list-info">
												<div>{data.performer}</div>
											</div>
										</div>
									</div>

								</div>
							</div>
				}

			</Content>
		)
	}
}
WorkDetails = createForm()(WorkDetails);
export default WorkDetails;