/*2018-03-01*/
import './index.less';

import React,{Component} from 'react';
import {withRouter} from "react-router";
import { Modal } from 'antd-mobile';

import Api from '../../../api/request';

import { list } from '../../../data/lmFlight';

class LMFlightList extends Component {
	constructor(props){
		super(props);

		this.state = {
			update:false,
		};
	};

	link  = (e,obj) => {
		e.preventDefault();
		this.props.history.push('/flight_order?'+obj.acreg + '&' + obj.fltid + '&' + obj.flightdate);
	};

	isType = ( obj,data ) => {


		if ( obj.next ) {
			data = data.nextAcFlightlog;
		};

		if ( obj.type == 'remark' ) {
			return (
				<li
					key={obj.type}
				>
					<p className={`task`} onClick={(e) => this.link(e,data)}>{data.workNum}</p>
					<p
						className={`tag ${data.remark?'':'icon_'}`}
						onClick={e => {
							e.preventDefault();
							Modal.prompt(data.acreg,data.fltid,[{text:'Clear'},{text:'OK',onPress:remark => {
								Api.post('acflightEdit/editAcFlight',{aclogid:data.aclogid,remark})
									.then(res => {
										console.log(res);
										if (res.errorCode == 0) {
											data.remark = remark;
											Modal.alert('success');
											this.setState({
												update:!this.state.update
											})
										};
									})
							}}],'default',data.remark)
						}}
					>
						{ data.remark || ''}
					</p>
				</li>
			)
		};
		return (
			<li key={obj.type}>{data[obj.field]}</li>
		)
	};

	render(){
		const { data } = this.props;
		return (
			<ul className={`lm-flight`}>

				{
					list.map( s => this.isType(s,data))
				}

				{/*<li>*/}
					{/*{data.acreg}*/}
				{/*</li>*/}
				{/*<li>{data.fltid}</li>*/}
				{/*<li>{data.arrstn}</li>*/}
				{/*<li>{data.etaFomat}</li>*/}
				{/*<li>{data.ataFomat}</li>*/}
				{/*<li>{data.gate}/TOW BAY</li>*/}
				{/*<li>{data.remark}</li>*/}
				{/*<li>{data.depstn}</li>*/}
				{/*<li>{data.etdFomat}</li>*/}
				{/*<li>{data.atdFomat}</li>*/}
				{/*<li>{data.depbay}</li>*/}
				{/*<li>{data.eic}</li>*/}
			</ul>
		)
	}
};

export default withRouter(LMFlightList);