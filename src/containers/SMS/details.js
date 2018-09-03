

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class ReportsDetails extends Component {
	constructor(props){
		super(props);
		console.log(props);
		this.state = {
			data:this.props.location.state,
			isRequest:false
		};

		this.flie = [1,2,3,4,5,6,7,8,9,10];
	}

	componentWillMount(){

	};

	render(){
		const {data,isRequest} = this.state;

		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="Reports Details"/>
				{
					data?<div className="manual-three">
						<div className="manual-title">
							{data.subject}
						</div>
						<div className="manual-describe">
							<p>{data.eventdetails}</p>
						</div>

						<div className="manual-list">
							<div className="details-list">
								<div className="list-title">Ref No.</div>
								<div className="list-info">
									<div>{data.refno}</div>
								</div>
							</div>
							<div className="details-list">
								<div className="list-title">Acreg</div>
								<div className="list-info">
									<div>{data.acreg}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Flight No.</div>
								<div className="list-info">
									<div>{data.flightno}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Injury</div>
								<div className="list-info">
									<div>{data.injury == '1'?'是':'否'}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Location</div>
								<div className="list-info">
									<div>{data.location}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Matrixid</div>
								<div className="list-info">
									<div>{data.matrixid}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Riskindex</div>
								<div className="list-info">
									<div>{data.riskindex}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Report Type</div>
								<div className="list-info">
									<div>{data.reporttype}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Status</div>
								<div className="list-info">
									<div>{data.status}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Report Date</div>
								<div className="list-info">
									<div>{data.reportdate}</div>
								</div>
							</div>

							<div className="details-list">
								<div className="list-title">Submitted Time</div>
								<div className="list-info">
									<div>{data.submittedtime}</div>
								</div>
							</div>

							{
								this.flie.map( s =>
									data[`file${s}`]?
										<div
											className="details-list"
											key={s}
										>
											<div className="list-title">File{s}</div>
											<div className="list-info">
												<div>{data[`file${s}`]}</div>
											</div>
										</div>:null
								)
							}
						</div>
					</div>
					:<div className={`noData hasPadding`}>请重新进入</div>
				}

			</Content>
		)
	}
}


export default ReportsDetails;