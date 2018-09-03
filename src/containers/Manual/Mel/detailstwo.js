import '../details.less';

import React,{Component} from 'react';
import { Modal,ActivityIndicator,Accordion, List } from 'antd-mobile';;
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Api from '../../../api/request';
import {Link} from 'react-router-dom';

class MelDetailsTwo extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource:false,
			data:[],
			datat:[],
			condition:{"parentId":''},
			key:'',
		};
		this.url = 'mel/findMELList';

	}
	componentWillMount(){
		this.update();
	};

	componentDidMount(){
		// this.update();
	};
	componentWillUnmount(){
		this.setState = _ => {};
	};

	update = _ => {
		let {condition} = this.state;
		condition.pageNow = 1;
		let ids = this.props.location.search.replace('?', '');
		let fp = ids.split("&&");
		condition.fileId = fp[0];
		condition.parentId = fp[1];
		console.log(condition);
		return Api.post(this.url, condition)
			.then(res => {
				if (res.errorCode == "0") {
					this.setState({
						dataSource: true,
						data: res.pageInfo.pageData,
					})
				} else {
					this.setState({
						dataSource: true,
					})
				}
			})
	};





	onChange = (key) => {
		console.log(key);
		let {condition} = this.state;
		condition.parentId = key;
		if (key == this.state.key) {
			this.setState({
				key: '',
			})
		} else {
			Api.post(this.url, condition)
				.then(res => {
					if (res.errorCode == "0") {
						this.setState({
							datat: res.pageInfo.pageData,
							key: key
						})
					}

				})
		}
	}

	render(){
		const {dataSource,data,datat,key,condition
		} = this.state;
		return (
			<Content
				style={{paddingBottom: 0}}
			>
				<Header
					title="MEL DETAILS.."
				>
				</Header>
				<div>
					{
						!dataSource ? <ActivityIndicator/> :
							<div>{
								data.length > 0 ? data.map((s, v) => {
									return (
										<div key={v} className={(s.TYPE == "0") ? 'melb' : 'melbc'}>
											<List>
												{(s.TYPE == "1") ? <Link
													to={{
														pathname: '/melDetailslast',
														search: `${condition.fileId}&&${s.ID}&&${s.NODETYPE}`
													}}
													key={v}
												>
													<div style={{
														backgroundColor: '#ddd',
														height: '1PX',
														width: '100%'
													}}></div>
													<List.Item>
														<div className="dt">{s.NAME}</div>
														<div
															className={(s.TYPE == "0") ? [(s.ID == key) ? "accordionmel" : "mel"] : ''}></div>
													</List.Item>
												</Link> : <div
													key={v}
												>
													<List.Item onClick={() => this.onChange(s.ID)}>
														<div className="dt">{s.NAME}</div>
														<div
															className={(s.TYPE == "0") ? [(s.ID == key) ? "accordionmel" : "mel"] : ''}></div>
													</List.Item>
												</div>
												}
											</List>
											{(s.ID == key) ? <div><List className="my-list">
												{
													datat.length > 0 ? datat.map((s, v) => (
														<Link
															to={{
																pathname: `${s.TYPE == "0" ? '/melDetailsthree' : '/melDetailslast'}`,
																search: `${condition.fileId}&&${s.ID}&&${s.NODETYPE}`
															}}
															key={v}
															className="melbc"
														>
															<div style={{
																backgroundColor: '#ddd',
																height: '1PX',
																width: '100%'
															}}></div>
															<List.Item key={s.ID}>
																<div className="dt">{s.NAME}</div>
																<div className={(s.TYPE == "0") ? "mel" : ""}></div>
															</List.Item>
														</Link>

													)) : ''
												}
											</List></div> : null}
										</div>
									)
								}) : ''}
							</div>
					}

				</div>
			</Content>
		)
	}
}



export default MelDetailsTwo