import React,{Component} from 'react';
import { Flex } from 'antd-mobile';

const FlexItem = Flex.Item;

export class FlightTitle extends Component {
    constructor(props){
        super(props);
    }

    render(){
        let {style} = this.props;
        const {timeType} = this.props;
        style = style?style:{};
        let type = timeType == '1'?true:false;
        return (
            <div className="flight-title">
                <Flex
                    justify="between"
                    style={style}
                >
                    <FlexItem>FLT NO</FlexItem>
                    <FlexItem>ACREG</FlexItem>
                    <FlexItem>{type?'STA':'ATA'}</FlexItem>
                    <FlexItem>GATE</FlexItem>
                    <FlexItem>STATUS</FlexItem>
                </Flex>
            </div>
        )
    }
}

export class FlightRows extends Component {
    constructor(props){
        super(props);
    }

    render(){
        const {s} = this.props;
        const {timeType} = this.props;
        let type = timeType == '1'?true:false;
        return (
            <Flex
                justify="between"
                className="flight-list"
            >
                <FlexItem className="flight-FLT">{s.fltid}</FlexItem>
                <FlexItem>{s.acreg}</FlexItem>
                <FlexItem>{type?s.ataFomat:s.staFomat}</FlexItem>
                <FlexItem>{s.gate}</FlexItem>
                <FlexItem className="flight-state">{s.status}</FlexItem>
            </Flex>
        )
    }
}


