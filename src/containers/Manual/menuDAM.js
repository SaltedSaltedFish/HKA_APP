import './menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class ManualMenuDam extends Component {
	constructor(){
		super();
		this.state = {
			data:[],
			isRequest:true
		}
	}

	componentWillMount(){
		const id = this.props.location.search.replace('?','');
		Api.post('damage/damage/detail ',{id})
			.then(res => this.setState({
				data:res.data.damage,
				isRequest:false
			}))
	};

	render(){
		const {data,isRequest} = this.state;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="DAM"/>
				{
					isRequest?<ActivityIndicator />:
						<div className="manual-three">
							<div className="manual-title">
                                 ACREG
								<span >{data.acreg}</span>
							</div>
							<div className="manual-describe">
								<p style={{color: '#b5b4bc'}}>DESCRIPTION</p>
								<p>{data.description}</p>
							</div>

							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">CAT</div>
									<div className="list-info">
										<div>{data.cat}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">APPROVALNO</div>
									<div className="list-info">
										<div>{data.approvalno}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">DAMAGEPOS</div>
									<div className="list-info">
										<div>{data.damagepos}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">TYPE</div>
									<div className="list-info">
										<div>{data.type}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">INTERVAL</div>
									<div className="list-info">
										<div>{data.interval}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">LIFELIMIT</div>
									<div className="list-info">
										<div>{data.lifelimit}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">THRESHOLD</div>
									<div className="list-info">
										<div>{data.threshold}</div>
									</div>
								</div>
							</div>
						</div>
				}

			</Content>
		)
	}
}


export default ManualMenuDam;