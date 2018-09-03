
import React,{Component} from 'react';
import {Flex} from 'antd-mobile';

import getState from '../../../utils/getState';

const FlexItem = Flex.Item;
class Group extends Component {
	constructor(props){
		super(props);
		//console.log(props);
		let data = props.data;
		this.state = {
			data
		};

		/*
		* status 1:批准 0:审批中 2:驳回
		* */
	};

	componentWillReceiveProps(data){
		this.setState({
			data:data.data
		})
	}

	render(){
		const { data } = this.state;
		let state = getState.applicationState(data.status?data.status:'');
		return (
			<div className="work-list">
				<span className="lv">{data.priority?data.priority:'C'}</span>
				<div className={`state ${state}`}>
					<div></div>
					<p>{state}</p>
				</div>
				<div className="list-top">
					<div className="introduction">
						<p className="title">{data.taskno}</p>
						<p className="list-color1">ApplyDate: {data.createdwhen}</p>
					</div>
				</div>
				<div className="list-bottom">
					<Flex
						justify="between"
					>
						<FlexItem>
							<p className="list-color2">{data.delayreason}</p>
						</FlexItem>
					</Flex>
				</div>
			</div>
		)
	}
}

Group.propTypes = {

};

export default Group;