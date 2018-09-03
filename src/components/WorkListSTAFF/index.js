import './index.less';

import React,{ Component } from 'react';
import { Flex } from 'antd-mobile';

import getState from '../../utils/getState';

const FlexItem = Flex.Item;

class WorkListSTAFF extends Component {
	constructor(props){
		super(props);
		let data = props.data;
		this.state = {
			data
		}
	};

	render(){

		const { data } = this.state;

		let listState = getState.state(data.taskState || data.taskcompletion || '');
		let dec = data.jobcarddescription || data.jobcardDescription;
		//console.log(data);
		return (
			<div
				className="work-list"
			>
				<span className="lv">{data.priority || 'C'}</span>
				<div className={`state ${listState.value}`}>
					<div></div>
					<p>{listState.label}</p>
				</div>
				<div className="list-top" style={dec?null:{border:'none'}}>
					<div className="introduction">
						<p className="title">{data.tasknum || data.taskno}</p>
						<p className="list-color1">PlanDate： {data.plandate1 || data.plandate}</p>
						<p className="list-color1">DueDate： {data.duedate1 || data.duedate}</p>
					</div>
				</div>
				{
					dec?
						<div className="list-bottom">
							<p className="list-color2">
								{ data.jobcarddescription || data.jobcardDescription }
							</p>
						</div>:null
				}
			</div>
		)
	}
}

WorkListSTAFF.propTypes = {

};

export default WorkListSTAFF;