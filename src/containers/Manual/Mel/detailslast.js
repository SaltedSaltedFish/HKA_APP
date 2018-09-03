import '../details.less';

import React,{Component} from 'react';
import { ActivityIndicator, } from 'antd-mobile';



import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';



class MelDetailslast extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource:true,
			data:[],
			condition:{},
			datas:[]
		};
		this.url = 'mel/findMELInfo';
	}

	componentDidMount(){
		this.update();
	}

	componentWillUnmount(){
		// this.setState = _ => {};
	};

	update = () => {
		let { condition } = this.state;
		condition.pageNow=1
		let ids = this.props.location.search.replace('?','');
		let fp=ids.split("&&");
		condition.fileId=fp[0];
		condition.id=fp[1];
		condition.nodetype=fp[2]
		return Api.post(this.url,condition)
			.then(res => {
				if (res.errorCode == 0) {
					this.setState({
						dataSource:false,
						data:res.data.other,
						datas:res.data
					})
				} else {
					this.setState({
						dataSource:false,
					})
				}
			})
	};




	render(){
		const {
			modalType,dataSource,data,datas
		} = this.state;
		const listlist=data.length?data.map((s,v)=>{
			return(
				<div
					className="manual-describe"
					key={v}
				>
					<div
						key={v}
						dangerouslySetInnerHTML={{__html:s.DESCHTML}}
						style={{textAlign:'-webkit-center'}}
					>
					</div>
					<div className="details-list">
						<div className="list-title">MXXH</div>
						<div className="list-info">
							<div>{s.MXXH}</div>
						</div>
					</div>
					<div className="details-list">
						<div className="list-title">CODE</div>
						<div className="list-info">
							<div>{s.CODE}</div>
						</div>
					</div>
					{(s.TYPE)?<div className="details-list">
						<div className="list-title">TYPE</div>
						<div className="list-info">
							<div>{s.TYPE}</div>
						</div>
					</div>:<div>
					< div className="details-list">
						<div className="list-title">ROUTING</div>
						<div className="list-info">
						<div>{s.ROUTING}</div>
						</div>
						</div>
						<div className="details-list">
						<div className="list-title">ASSESSMENT</div>
						<div className="list-info">
						<div>{s.ASSESSMENT}</div>
						</div>
						</div>
					</div>
					}
				</div>
			)}):'';
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="MELINFO"
				>
				</Header>
				<div className="manual-details newView">
					{
						dataSource?<ActivityIndicator />:
							<div className="manualSelect-list">
								<div className="details-list">
									<div className="list-title">FUNCCODE</div>
									<div className="list-info">
										<div>{datas.FUNCCODE}</div>
									</div>
								</div>
								<div className="manual-describe">
									<p style={{color: '#b5b4bc'}}>TITLE</p>
									<p>{datas.TITLE}</p>
									<p style={{color: '#b5b4bc'}}>IDENT</p>
									<p>{datas.IDENT}</p>
									<p style={{color: '#b5b4bc'}}>APPLICABLIE</p>
									<p>{datas.APPLICABLIE}</p>
								</div>
								{listlist}

							</div>
					}

				</div>

			</Content>
		)
	}
}


export default MelDetailslast;