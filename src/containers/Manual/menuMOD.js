import './menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class ManualMenuMod extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:this.props.location.state.s,
			// isRequest:true
		}
	}

	componentWillMount(){
		// const modid = this.props.location.search.replace('?','');
		// Api.post('mod/mod/detail',{modid})
		// 	.then(res => this.setState({
		// 		data:res.data.mod,
		// 		isRequest:false
		// 	}))
	};

	render(){
		const {data,isRequest} = this.state;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="MODDTAILS"/>
						<div className="manual-three">
							<div className="manual-title">
								ACREG
								<span >{data.acreg}</span>
							</div>
							<div className="manual-describe">
								<p style={{color: '#b5b4bc'}}>TITLE</p>
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
									<div className="list-title">MOD</div>
									<div className="list-info">
										<div>{data.mod}</div>
									</div>
								</div>
								{/*<div className="details-list">*/}
									{/*<div className="list-title">DueUpdatedWhen</div>*/}
									{/*<div className="list-info">*/}
										{/*<div></div>*/}
									{/*</div>*/}
								{/*</div>*/}
								{/*<div className="details-list">*/}
									{/*<div className="list-title">FlightNumber</div>*/}
									{/*<div className="list-info">*/}
										{/*<div></div>*/}
									{/*</div>*/}
								{/*</div>*/}
								{/*<div className="details-list">*/}
									{/*<div className="list-title">PlanDate</div>*/}
									{/*<div className="list-info">*/}
										{/*<div></div>*/}
									{/*</div>*/}
								{/*</div>*/}
								{/*<div className="details-list">*/}
									{/*<div className="list-title">References</div>*/}
									{/*<div className="list-info">*/}
										{/*<div></div>*/}
									{/*</div>*/}
								{/*</div>*/}
							</div>
						</div>
			</Content>
		)
	}
}


export default ManualMenuMod;