import './index.css';

import React,{Component} from 'react';
import {Flex} from 'antd-mobile';
import getState from '../../utils/getState';

const FlexItem = Flex.Item;

class WorkDetails extends Component {
    constructor(props){
        super(props);
        this.state = {

        };
    }

    render(){
        const {data} = this.props;
        let state = getState.state(data.taskcompletion?data.taskcompletion:'');
        return (
            <div className="work-list">
                <span className="lv">{data.priority?data.priority:'C'}</span>
                <div className={`state ${state}`}>
                    <div></div>
                    <p>{state}</p>
                </div>
                <div className="list-top">
                    <div className="introduction">
                        <p className="title">{data.wono}</p>
                        <p className="list-color1">Assigned to: GROUP {data.team}</p>
                    </div>
                </div>
                <div className="list-bottom">
                    <Flex
                        justify="between"
                    >
                        <FlexItem>
                            <div className="list-info">
                                <p className="list-color2">PlanDate</p>
                                <p>{data.plandate}</p>
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
                                <p>{data.acreg}</p>
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
                                <p>{data.tasknum?data.tasknum:data.taskno}</p>
                                <span
                                    style={{
                                        width:'1px',
                                        top:'5px'
                                    }}
                                ></span>
                            </div>
                        </FlexItem>
                    </Flex>
                </div>
            </div>
        )
    }
}

export default WorkDetails;