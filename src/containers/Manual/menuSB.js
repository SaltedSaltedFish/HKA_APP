import './menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class ManualMenuSb extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:this.props.location.state.s,
			isRequest:true
		}
	}

	componentWillMount(){
		// const sbid = this.props.location.search.replace('?','');
		//
		// Api.post('mod/sb/detail', {sbid})
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
				<Header title="SB DETAILS"/>
						<div className="manual-three">
							<div className="manual-title">
                               SB NO.
								<span >{data.sbno}</span>
							</div>
							<div className="manual-describe">
								{/*<p style={{color: '#b5b4bc'}}>TITLE</p>*/}
								<p>{data.title}</p>
							</div>

							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">ATA</div>
									<div className="list-info">
										<div>{data.ata}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">ACCDATE</div>
									<div className="list-info">
										<div>{data.accdate}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">ACSTATUS</div>
									<div className="list-info">
										<div>{data.acstatus}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">MSN</div>
									<div className="list-info">
										<div>{data.msn}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">NATURE</div>
									<div className="list-info">
										<div>{data.nature}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">MP</div>
									<div className="list-info">
										<div>{data.mp}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">MOD</div>
									<div className="list-info">
										<div>{data.mod}</div>
									</div>
								</div>
							</div>
						</div>
			</Content>
		)
	}
}


export default ManualMenuSb;