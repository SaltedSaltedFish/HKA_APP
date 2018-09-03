import './index.css';

import React,{Component} from 'react';
import { Flex } from 'antd-mobile';
import { Link } from 'react-router-dom';
import getState from '../../../utils/getState';

import Content from '../../../components/Content';
import FlightInfo from '../../../components/FlightInfo';

const FlexItem = Flex.Item;

class WorkDetailsStaff extends Component {
    constructor(){
        super();
        this.state = {

        };
    }

    componentWillMount(){

    }

    render(){
        const {data,id} = this.props;
        console.log(data);
        let tool = data.tool;
        let meterials = data.meterials;
        let workOrder = data.workOrder;
        let state = getState.state(workOrder.taskcompletion);
        return (
                <div></div>
        )
    }
}

export  default WorkDetailsStaff;