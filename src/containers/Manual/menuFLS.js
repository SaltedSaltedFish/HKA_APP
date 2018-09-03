import './menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class ManualMenuFls extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:this.props.location.state.s,
			isRequest:true
		}
	}

	componentWillMount(){
		// const id = this.props.location.search.replace('?','');
		// Api.post('',{id})
		// 	.then(res => this.setState({
		// 		data:res.data,
		// 		isRequest:false
		// 	}))
	};

	render(){
		const {data,isRequest} = this.state;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="FLSDTAILS"/>
						<div className="manual-three">
							<div className="manual-title">
                               ACREG
								<span >{data.acreg}</span>
							</div>
							<div className="manual-describe">
								<p style={{color: '#b5b4bc'}}>HARDWARE</p>
								<p>{data.hardware}</p>
							</div>

							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">SOFTWARE</div>
									<div className="list-info">
										<div>{data.software}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">FIN</div>
									<div className="list-info">
										<div>{data.fin}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">HARDPN</div>
									<div className="list-info">
										<div>{data.hardpn}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">QTY</div>
									<div className="list-info">
										<div>{data.qty}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">RN</div>
									<div className="list-info">
										<div>{data.rn}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">SOFTPN</div>
									<div className="list-info">
										<div>{data.softpn}</div>
									</div>
								</div>
							</div>
						</div>
			</Content>
		)
	}
}


export default ManualMenuFls;