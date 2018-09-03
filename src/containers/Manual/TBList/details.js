import '../menu.less';

import React,{Component} from 'react';
import { ActivityIndicator} from 'antd-mobile';
import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';

class TbManualMenu extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:{},
			other:[],
			isRequest:false,
		}
	}

	componentWillMount(){
    this.updata()
	};

	updata=()=>{
		const id = this.props.location.search.replace('?','');
		Api.post("tb/findTBById",{id})
			.then(res => {
				if(res.errorCode == 0) {
					this.setState({
						data :res.data,
						other:res.data.OTHER
					})
				}
			});
	}
	render(){
		const {data,isRequest,other} = this.state;

		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header title="TbDetails"/>
				{
					isRequest?<ActivityIndicator />:
						<div className="manual-three">
							<div className="details-list">
								<div className="list-title">ATA</div>
								<div className="list-info">
									<div>{data.ATA}</div>
								</div>
							</div>
							<div className="manual-describe">
								<p style={{color: '#b5b4bc'}}>SUBJECT</p>
								<p>{data.SUBJECT}</p>
							</div>

							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">EFFECTIVE DATE</div>
									<div className="list-info">
										<div>{data.EFFECTIVEDATE}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">DESTROY DATE</div>
									<div className="list-info">
										<div>{data.DESTROYDATE}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">AC/TYPE</div>
									<div className="list-info">
										<div>{data.ACTYPE}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">AC/MODEL</div>
									<div className="list-info">
										<div>{data.ACMODEL}</div>
									</div>
								</div>
								<div className="details-list">
									<div className="list-title">DISTRIBUTE</div>
									<div className="list-info">
										<div>{data.DISTRIBUTE}</div>
									</div>
								</div>
								{other.length ? other.map((s, v) => (
									<div
										key={v}
										dangerouslySetInnerHTML={{__html:s.NOTES}}
										className="manual-describe"
									>
									</div>
								)) : ''}

							</div>
						</div>

				}

			</Content>
		)
	}
}


export default TbManualMenu;