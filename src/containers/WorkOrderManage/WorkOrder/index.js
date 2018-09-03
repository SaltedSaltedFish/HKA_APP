import './index.css';

import React,{Component} from 'react';
import { Tabs,Flex,Button,DatePicker} from 'antd-mobile';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';

import { TimeChoice } from '../../../components/TimeChoice';

import Content from '../../../components/Content';
import Transition from '../../../components/Transition';
import WorkCondition from '../WorkCondition';

import Assigned from './Assigned';
import Undistributed from './Undistributed';
import Pending from './Pending';

import TimeConversion from '../../../utils/TimeConversion';


const TabPane = Tabs.TabPane;
const FlexItem = Flex.Item;

class WorkOrderManage extends Component {
    constructor(props){
        super(props);

        let flightdate = TimeConversion.date();
        let conditionP = sessionStorage.workCondition?JSON.parse(sessionStorage.workCondition):{assigndate:flightdate};
        this.state = {
            tabValue:'1',

			inProp:false,
	        flightdate,

			conditionP,
        };
    }

    componentWillMount(){
        //console.log(localStorage.identity);
        // let identity = localStorage.identity == 'Y'?true:false;
        // this.setState({identity});
    };

    componentDidMount(){

    };

    componentWillUnmount(){
    	//console.log(this.state.conditionP);
    	sessionStorage.workCondition = JSON.stringify(this.state.conditionP);
        this.setState = _ => {};
    };

	updateTime = (...obj) =>{
		//console.log(...obj,obj);
		obj[0].flightdate = obj[0].nowDate;
		this.setState(...obj);
	};

    getFlights = () => {
        //console.log(this.refs.input.value);
        let acreg = this.refs.input.value;
        if (acreg != '') {
            this.setState({
                acreg
            })
        }
    };

    handleTabClick = _ => {
        //console.log('onTabClick', _);
    };

    callback = tabValue => {
        this.setState({
            tabValue
        });

        sessionStorage.tabValue = tabValue;
    };

	toggle = _ => {
		this.setState({
			inProp:!this.state.inProp
		});
	};

	update = (obj) => {
		this.setState({
			conditionP:obj
		})
	};

    render(){
        const { acreg,flightdate,tabValue,inProp,conditionP } = this.state;

        let isTab = tabValue == '1'|| tabValue == '3';

        if (sessionStorage.tabValue && sessionStorage.tabValue == '2') {
            isTab = false
        };

        return (
                <Content
                    className="workSelect"
                >
                    <div id="common-header">
                        <Link
                            to={{
                                pathname:'/scanning'
                            }}
                        >
                            <div className="icon icon-scanning">

                            </div>
                        </Link>
                        {/*<Link*/}
                            {/*to={{*/}
                                {/*pathname: '/add_task'*/}
                            {/*}}*/}
                        {/*>*/}
                            {/*<div className="icon icon-task">*/}

                            {/*</div>*/}
                        {/*</Link>*/}

                        {/*<div className="search">*/}
                            {/*<div className="search-container">*/}
                                {/*<from>*/}
                                    {/*<input type="text" />*/}
                                {/*</from>*/}
                            {/*</div>*/}
                        {/*</div>*/}

						<div className="icon icon-condition" style={{right:0}} onClick={this.toggle}>

						</div>

                        <p className="title">Work Order</p>
                    </div>

                    {
                        isTab?null:
                            <div className="special">
                                <div className="manual-select">
                                    <Flex className="mation-bottom">
                                        <FlexItem>
                                            <div className="mation-list">
                                                <input type="text" ref="input" placeholder={`ACREG`}/>
                                            </div>
                                        </FlexItem>
                                        <FlexItem>
                                            <Button
                                                onClick={this.getFlights}
                                            >
												Search
											</Button>
                                        </FlexItem>
                                    </Flex>
                                </div>

                                <TimeChoice nowDate={flightdate} fn={this.updateTime}/>
                            </div>

                    }
                    <div
                        className={`tabs ${isTab?``:`special`}`}
                    >
                        <Tabs
                            defaultActiveKey={ sessionStorage.tabValue?sessionStorage.tabValue:'1'}
                            animated={false}
                            onChange={this.callback}
                            onTabClick={this.handleTabClick}
                            underlineColor="transparent"
                            activeUnderlineColor="transparent"
                        >
                            <TabPane tab="Assigned" key="1">
                                <Assigned {...conditionP}/>
                            </TabPane>
                            {
                                /*
                                <TabPane tab="RELATION" key="2">
                                    <Undistributed flightdate={flightdate} acreg={acreg} />
                                </TabPane>
                                */
                            }
                            <TabPane tab="Pending" key="3">
                                <Pending {...conditionP}/>
                            </TabPane>
                        </Tabs>
                    </div>


                    {
						inProp?
                            <Transition
                            >
                                <div className="mark" onClick={this.toggle}></div>
                                <WorkCondition condition={conditionP} fn={this.update} toggle={this.toggle}/>
                            </Transition>:null

                    }

                </Content>
        )
    }
}

WorkOrderManage = connect(state => {return {state:state.AdminWorksheetList}})(WorkOrderManage);
WorkOrderManage = createForm()(WorkOrderManage);
export default WorkOrderManage;