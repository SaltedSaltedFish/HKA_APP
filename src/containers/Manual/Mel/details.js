import '../details.less';

import React,{Component} from 'react';
import { Modal,ActivityIndicator,Accordion, List } from 'antd-mobile';;
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Api from '../../../api/request';
import {Link} from 'react-router-dom';
import {createForm} from "rc-form";

class MelDetails extends Component {
	constructor(props){
		super(props);
		this.state = {
			dataSource:false,
		    data:[],
			datat:[],
			condition:{"parentId":"0"},
			key:'',
		};
		this.url = 'mel/findMELList';

	}
	componentWillMount(){
		this.update();
	};


	componentWillUnmount(){
		// this.setState = _ => {};
	};

	update = _ => {
		let { condition } = this.state;
		condition.pageNow = 1;
		condition.fileId = this.props.location.search.replace('?','');
		return Api.post(this.url,condition)
			.then(res => {
				if (res.errorCode == "0") {
					this.setState({
						dataSource:true,
						data:res.pageInfo.pageData,
					})
				} else {
					this.setState({
						dataSource:true,
					})
				}
			})
	};





	onChange = (key) => {
		console.log(key);
		let { condition } = this.state;
		condition.parentId=key;
		if(key==this.state.key){
			this.setState({
				key:'',
			})
		}else {
		Api.post(this.url,condition)
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

	modalType = _ => {
		this.setState({
			modalType:true
		});
	};
	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType:false
		});
	};

	submit = _ => {
		let { condition } = this.state;
		this.props.form.validateFields((error, value) => {
			// setTimeout(()=>{
			// 	if (!error) {
			// 		let condition = {};
			// 		condition = {...value};
			// 		this.setState({
			// 			modalType:false,
			// 			condition
			// 		});
			// 		this.update()
			// 	}},500)
			window.location.href=`#/melDetailsthree?${condition.fileId}&&${value.title}&&search`;
		});
	};
	render(){
		const {dataSource,data,datat,key,condition,modalType
		} = this.state;
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="MEL DETAILS"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
				<div>
					{
						!dataSource?<ActivityIndicator />:
							<div  >{
								data.length>0?data.map((s,v)=>{
								return(
									<div key={v} className="melb">
										<div style={{backgroundColor:'#ddd',height:'1PX',width:'100%'}}></div>
								<List>
									<List.Item   onClick={()=>this.onChange(s.ID)}><div className="dt">{s.NAME}</div><div className={(s.ID==key)?"accordionmel":"mel"}></div></List.Item>
								</List>

									{(s.ID==key)?<List className="my-list">
									{
										datat.length>0?datat.map((s, v) => (
											<Link
												to={{
													pathname:`${s.TYPE=="0"?'/melDetailsTwo':'/melDetailslast'}`,
													search:`${condition.fileId}&&${s.ID}&&${s.NODETYPE}`
												}}
												key={v}
												className="melbc"
											>
												<div style={{backgroundColor:'#ddd',height:'1PX',width:'100%'}}></div>
												<List.Item ><div className="dt">{s.NAME}</div><div className={(s.TYPE=="0")?"mel":""}></div></List.Item>
												</Link>
										)):''}
								</List>:null}

									</div>
								)}):''}
							</div>
					}

				</div>
				<Modal
					visible={modalType}
					// popup = {false}
					animationType="slide-down"
					onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					title={`Criteria`}
				>
					<div className="from-input">
						<from className="submit">
							<div className="group-input" >
								<span>TITLE</span>
								<input  type="text" {...getFieldProps('title',{
									initialValue:''
								})}/>
							</div>
							<div className="group-button">
								<div className="button red" onClick={this.submit}>
									Submit
								</div>
							</div>
						</from>
					</div>
				</Modal>
			</Content>
		)
	}
}


MelDetails = createForm()(MelDetails);
export default MelDetails