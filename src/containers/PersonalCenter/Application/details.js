import './index.css';

import React,{Component} from 'react';
import { Flex } from 'antd-mobile';
import { Link } from 'react-router-dom';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import WorkListSTAFF from '../../../components/WorkListSTAFF';
import Group from './group';

import Native from '../../../utils/Native';
import getState from '../../../utils/getState';
import Api from '../../../api/request';

const FlexItem = Flex.Item;

class MyApplicationDetails extends Component {
	constructor(props){
		super(props);
		console.log(props);
		let data = props.location.state?props.location.state:{};

		let id = data.fromassignworkid?
			data.fromassignworkid:
			props.location.search.replace('?id=','');

		let turnid = data.turnid;

		let button = data.status == '0';

		this.state = {
			data,
			workData:false,
			id,
			turnid,

			button
		};

		this.url = 'message/delay/delete';
	};

	componentWillMount(){

		Api.post('workorder/getEnginnerWorkInfo',{assignworkid:this.state.id})
			.then(res => {
				this.setState({
					workData:res.data
				});
			})
	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	submit = _ => {
		const { turnid } = this.state;
		Native.showWaiting();
		Api.post(this.url,{turnid})
			.then(res => {
				Native.closeWaiting();
				if ( res.data.status == 1 ) {

					Native.alert('success');
					this.setState({
						button:false
					});
					return;

				};

				Native.alert('Network error or has been approved');

				console.log(res);

			})
	};

	render(){
		const { data,workData,button } = this.state;
		let state = getState.applicationState(data.approve?data.approve:'');
		let tool = [],meterials = [],workOrder = {};
		if(workData) {
			tool = workData.tool;
			meterials = workData.meterials;
			workOrder = workData.workOrder;
		}
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="Application Details" />
				{
					workData.workOrder?
						<div>
							<div className="details-top">
								<div className="details-work">
									<WorkListSTAFF data={ workOrder } />
								</div>
							</div>

							{
								tool.length > 0?
									<div className="details-workInfo">
										<h2>TOOLS</h2>
										<div className="workInfo-container">
											{
												tool.map((s,v)=>
													<div key={v} className="workInfo-list">
														<div className="list-title">
															<div>
																<span>ToolPN：</span>
																<span className="title-info">{s.pn}</span>
															</div>
															<div>
																<span>QTY：</span>
																<span className="title-info">{s.qty}</span>
															</div>
														</div>
														<div className="list-info">
															{s.descriptions}
														</div>
													</div>
												)
											}
										</div>
									</div>:null
							}

							{
								meterials.length > 0?
									<div className="details-workInfo">
										<h2>METERIALS</h2>
										<div className="workInfo-container">
											{
												meterials.map((s,v)=>
													<div key={v} className="workInfo-list">
														<div className="list-title">
															<div>
																<span>ToolPN：</span>
																<span className="title-info">{s.pn}</span>
															</div>
															<div>
																<span>QTY：</span>
																<span className="title-info">{s.qty}</span>
															</div>
														</div>
														<div className="list-info">
															{s.descriptions}
														</div>
													</div>
												)
											}
										</div>
									</div>:null
							}

							<div className="details-bottom">

								<div className="details-list">
									<div className="list-title">
										Zone
									</div>
									<div className="list-info">
										<div>{workOrder.zone}</div>
									</div>
								</div>

								<div className="details-list">
									<div className="list-title">
										FlightNum
									</div>
									<div className="list-info">
										<div>{workOrder.flightnum}</div>
									</div>
								</div>

								<div className="details-list">
									<div className="list-title">
										engineeruser
									</div>
									<div className="list-info">
										<div>{workOrder.engineeruser}</div>
									</div>
								</div>

								<div className="details-list">
									<div className="list-title">
										MH
									</div>
									<div className="list-info">
										<div>{workOrder.manhours}</div>
									</div>
								</div>

								{
									button?
										data.turnid?
										<div className="from-input">
											<Flex
												className="applicationButton application"
											>
												<FlexItem>
													<div className="button button-reject" onClick={this.submit}>
														<span className="icon icon-reject"></span>
														<p>WITHDRAW</p>
													</div>
												</FlexItem>
											</Flex>
										</div>:null:null
								}

							</div>
						</div>:<div className="noData hasPadding">No Data</div>
				}
			</Content>
		)
	}
}

export default MyApplicationDetails;