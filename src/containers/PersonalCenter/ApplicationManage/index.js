import './index.css';

import React,{Component} from 'react';
import { Tabs } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import AddedList from './list';
import Audited from './audited';

const TabPane = Tabs.TabPane;

class ApplicationManage extends Component {
    constructor(props){
        super(props);
        let defaultActiveKey = sessionStorage.ApplicationKey?sessionStorage.ApplicationKey:'1';
        this.state = {
			defaultActiveKey
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
        const { defaultActiveKey } = this.state;
        return (
            <div>
                <Header title="REQUIRES"/>
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
                        <TabPane tab='AWAITING' key="1">
                            <div className="added-container">
                                <AddedList identity />
                            </div>
                        </TabPane>
                        <TabPane tab='AUDITED' key="2">
                            <div className="added-container">
								<Audited identity />
                            </div>
                        </TabPane>
                    </Tabs>
                </Content>
            </div>
        )
    }
}

export default ApplicationManage;