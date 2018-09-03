

import React,{Component} from 'react';
import { Tabs } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import FailureResults from './failureResults';
import FailureCause from './failureCause';
import FaultTestingProcess from './faultTestingProcess';

const TabPane = Tabs.TabPane;

class Details extends Component {
	constructor(props){
		super(props);
		let defaultActiveKey = sessionStorage.ApplicationKey?sessionStorage.ApplicationKey:'1';
		this.state = {
			defaultActiveKey,
			taskId: this.props.location.search.replace('?','')
		}
	}

	callback = key => {
		//console.log('onChange', key);
		this.state.defaultActiveKey = key;
	};

	handleTabClick = key => {
		//console.log('onTabClick', key);
	};

	componentWillUnmount(){
		sessionStorage.ApplicationKey = this.state.defaultActiveKey;
		this.setState = () => {};
	};

	render(){
		const { defaultActiveKey ,taskId} = this.state;
		return (
			<div>
				<Header title="Details"/>
				<Content
					style={{paddingBottom:0}}
				>
					<Tabs
						defaultActiveKey={ defaultActiveKey }
						onChange={this.callback}
						onTabClick={this.handleTabClick}
						animated={false}
						className="added"
					>
						<TabPane tab='FailureCause' key="1">
							<div className="added-container">
								<FailureCause taskId={taskId} />
							</div>
						</TabPane>
						<TabPane tab='FaultTestingProcess' key="2">
							<div className="added-container">
								<FaultTestingProcess taskId={taskId} />
							</div>
						</TabPane>
						<TabPane tab='FailureResults' key="3">
							<div className="added-container">
								<FailureResults taskId={taskId} />
							</div>
						</TabPane>
					</Tabs>
				</Content>
			</div>
		)
	}
}

export default Details;