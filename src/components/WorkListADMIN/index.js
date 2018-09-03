import './index.less';

import React,{ Component } from 'react';
import { Flex } from 'antd-mobile';

import getState from '../../utils/getState';

const FlexItem = Flex.Item;

class WorkListADMIN extends Component {
	constructor(props){
		//console.log(props);
		super(props);
		let data = props.data;
		this.state = {
			data
		};
	};

	componentWillReceiveProps(data){
		//console.log(data);
		this.setState({data:data.data});
	};

	componentWillUnmount(){
		this.setState = _ => {};
	};

	render(){
		const { data } = this.state;
		const { pending } = this.props;

		let s = data;
		let listState = getState.state(s.taskState || s.taskcompletion || '');
		return (
			<div
				className="work-list"
			>
				<span className="lv">{s.priority?s.priority:'C'}</span>
				<div className={`state ${listState.value}`}>
					<div></div>
					<p>{listState.label}</p>
				</div>
				<div className="list-top">
					<div className="introduction">
						<p className="title">{s.wono}</p>
						{
							pending?null:<p className="list-color1">Assigned to: { s.engineer || s.performer }</p>
						}
						<p className="list-color1">PlanDate: {s.plandate1 || s.plandate}</p>
						<p className="list-color1">DueDate: {s.duedate1 || s.duedate}</p>
					</div>
				</div>
				<div className="list-bottom">
					<Flex
						justify="between"
					>
						<FlexItem>
							<div className="list-info">
								<p className="list-color2">PlanDate</p>
								<p>{s.plandate1 || s.plandate}</p>
								<span
									style={{
										width:'1px',
										top:'5px'
									}}
								></span>
							</div>
						</FlexItem>
						<FlexItem>
							<div className="list-info">
								<p className="list-color2">Acreg</p>
								<p>{s.acreg}</p>
								<span
									style={{
										width:'1px',
										top:'5px'
									}}
								></span>
							</div>
						</FlexItem>
						<FlexItem
							style={{flex:1.2}}
						>
							<div className="list-info">
								<p className="list-color2">TaskNum</p>
								<p>{s.tasknum}</p>
								<span
									style={{
										width:'1px',
										top:'5px'
									}}
								></span>
							</div>
						</FlexItem>
					</Flex>
					{
						s.taskdesc?
							<p
								className="list-color2 work-dec"
							>
								{s.taskdesc}
							</p>:null
					}

				</div>
			</div>
		)
	}
};

WorkListADMIN.propTypes = {

};

export default WorkListADMIN;