import '../menu.less';

import React,{Component} from 'react';
import { ActivityIndicator} from 'antd-mobile';
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import TimeConversion from '../../../utils/TimeConversion';

import Api from '../../../api/request';

class TADetails extends Component {
	constructor(props){
		super(props);
		let technicaladvisoryid = this.props.location.search.replace('?','');
		this.state = {
			data:{},
			isRequest:false,
			technicaladvisoryid,
			dataArray:[]
		}
	}

	componentWillMount(){
        this.update()
	};

	update =()=>{
		const { technicaladvisoryid } = this.state;
		Api.post("ta/detail",{ technicaladvisoryid })
			.then(res => {
				if(res.errorCode == 0) {
					console.log(res);
					let dataArray = Object.keys(res.data.ta);
					let data = res.data.ta;
					this.setState({
						data,
						dataArray,
					})
				}
			});
	};
	render(){
		const { data,isRequest,dataArray } = this.state;

		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="TA Details"/>
				{
					isRequest?<ActivityIndicator />:
						<div className="manual-three">
							<div className="details-list">
								<div className="list-title">TANO</div>
								<div className="list-info">
									<div>{data.tano}</div>
								</div>
							</div>
							<div className="manual-describe">
								<p style={{color: '#b5b4bc'}}>SUBJECT</p>
								<p>{data.subject}</p>
							</div>
			                       	<div className="details-list">
			              		<div className="list-title">AIRCRAFT MODEL</div>
									<div className="list-info">
									<div>{data.effectacmodel}</div>
							</div>
							</div>

								<div className="details-list">
									<div className="list-title">RELATION OF 'TA' REVISIONS</div>
									<div className="list-info">
										<div>{data.history_revisions}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">APPLICABILITY</div>
									<div className="list-info">
										<div>{data.effectacreg}</div>
									</div>
								</div>

							<div className="details-list">
								<div className="list-title">EFFECTDATE</div>
								<div className="list-info">
									<div>{TimeConversion.TIME(data.effectdate)}</div>
								</div>
							</div>
							<div className="manual-list">
								{
									dataArray.map(s=>
											s=='revision'||
											s=='background'||
										s=='referencedocument'||
										s=='revision_reason'||
										s=='sendto'||
										s=='textpart'?
										<div
											key={s}
											className="details-list">
											<div className="list-title">{s}</div>
											<div className="list-info">
												<div>{data[s]}</div>
											</div>
										</div>:null
									)
								}
								<div className="details-list">
									<div className="list-title">CATEGORY</div>
									<div className="list-info">
										<div>{data.category}</div>
									</div>
								</div>
							</div>

						</div>

				}

			</Content>
		)
	}
}


export default TADetails;