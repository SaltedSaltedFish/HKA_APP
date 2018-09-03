import './index.css';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';

class NRCDetails extends Component {
	constructor(){
		super();
		this.state = {
			data:[],
			isRequest:true
		}
	}

	componentWillMount(){
		const regid = this.props.location.search.replace('?regid=','');
		Api.post('nrc/detail',{regid})
			.then(res => this.setState({
				data:res.data.nrc,
				isRequest:false
			}))
	};

	render(){
		const {data,isRequest} = this.state;
		let array = Object.entries(data);
		//console.log(array);
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title={data.actype}/>
				{
					isRequest?<ActivityIndicator />:
						<div className="manual-three">
							<div className="manual-title">
								{data.acreg}
							</div>
							<div className="manual-describe">
								<p style={{color: '#b5b4bc',textIndent:'0'}}>Defect Desc</p>
								<p>{data.defectsdescription}</p>
							</div>

							<div className="manual-list">

								{
									array.map((s,v)=>
										{
											if (
												s[0] == 'acreg' ||
												s[0] == 'defectsdescription'
											) {
												return null
											} else {
												return (
													<div key={v} className="details-list">
														<div className="list-title">{s[0]}</div>
														<div className="list-info">
															<div>{s[1]}</div>
														</div>
													</div>
												)
											}
										}
									)
								}

							</div>
						</div>
				}

			</Content>
		)
	}
}


export default NRCDetails;