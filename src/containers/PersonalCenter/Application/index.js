import './index.css';

import React,{Component} from 'react';
import {Tabs,DatePicker} from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';

import AddedList from './list';
import AddedAdopt from './listAdopt';
import AddedReject from './listReject';
import AddedReview from './listReview';

const TabPane = Tabs.TabPane;

const DatePickerChildren = props => (
    <div
        onClick={props.onClick}
        className="icon icon-time"
    >
    </div>
);

let nowDate = TimeConversion.date();
let zhNow = moment(nowDate).locale('zh-cn').utcOffset(8);

class Application extends Component {
    constructor(){
        super();
        this.state = {
            dpValue:zhNow,
            nowDate:nowDate,
        }
    }

    callback = key => {
        //console.log('onChange', key);
    };

    handleTabClick = key => {
        //console.log('onTabClick', key);
    };

    //  时间变化
    dateChange = _ => {
        const date = _._d;
        let nowDate = TimeConversion.TIME(date);
        let condition = {};
        //condition.flightdate = nowDate;
        this.setState({ dpValue: _ ,nowDate:nowDate});
    };

    render(){
        const { nowDate } = this.state;
		let identity = Boolean(Number(localStorage.identity));
        return (
            <Content
                style={{paddingBottom:0}}
                className="application"
            >
				<Header title="My Application"/>

                <Tabs
                    defaultActiveKey="1"
                    onChange={this.callback}
                    onTabClick={this.handleTabClick}
                    animated={false}
                    className="added"
                >
                    <TabPane tab='ALL' key="1">
                        <div className="added-container">
                            <AddedList pathname="/my_application_details" applydate={nowDate} identity />
                        </div>
                    </TabPane>
                    <TabPane tab='IN REVIEW' key="2">
                        <div className="added-container">
                            <AddedAdopt pathname="/my_application_details" applydate={nowDate} identity />
                        </div>
                    </TabPane>
                    <TabPane tab='ADOPT' key="3">
                        <div className="added-container">
                            <AddedReject pathname="/my_application_details" applydate={nowDate} identity />
                        </div>
                    </TabPane>
                    <TabPane tab='REJECT' key="4">
                        <div className="added-container">
                            <AddedReview pathname="/my_application_details" applydate={nowDate} identity />
                        </div>
                    </TabPane>
                </Tabs>
            </Content>
        )
    }
}

export default Application;