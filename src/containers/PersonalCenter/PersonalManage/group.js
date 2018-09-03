import './group.less';

import React,{Component} from 'react';
import {Flex} from 'antd-mobile';
import {Link} from 'react-router-dom';

const FlexItem = Flex.Item;

class PersonalGroup extends Component {
    constructor(){
        super();
    }

    render(){
        //console.log(this.props);
        const {data} = this.props;
        let a = Object.keys(data.datalist);
        return (
            <div className="personalGroup">
                <h2>{data.team}</h2>
                {
                    a.map((n,m)=>{
                        let list = data.datalist[n];
                        return (
                            list.length == 0?null:
                            <div className="personalGroup-list" key={m}>
                                <div className="title">
                                    <p className="listLeft float">{n.enginerr == 'enginerr'?'ENGINEER':'MECHANIC'}</p>
                                    <Flex
                                        className="listRight float"
                                    >
                                        <FlexItem>DAY</FlexItem>
                                        <FlexItem>EVENING</FlexItem>
                                        <FlexItem>REST</FlexItem>
                                    </Flex>
                                </div>

                                {
                                    list.map((obj,key) =>
                                        <div className="listDetails" key={key}>
                                            <div className="listLeft float">
                                                <div className="people">
                                                    <span className="img">
                                                        <img src={require('../../../../static/images/287251719018053570.png')} alt=""/>
                                                    </span>
                                                    {obj.sysuser}
                                                </div>
                                            </div>
                                            <Flex
                                                className="listRight float"
                                            >
                                                <FlexItem className={obj.daywork=='Y'?'day':null}></FlexItem>
                                                <FlexItem className={obj.nightwork=='Y'?'evening':null}></FlexItem>
                                                <FlexItem className={obj.rest=='Y'?'rest':null}></FlexItem>
                                            </Flex>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }

                {/*<div className="personalGroup-list">*/}
                    {/*<div className="title">*/}
                        {/*<p className="listLeft float">ENGINEER</p>*/}
                        {/*<Flex*/}
                            {/*className="listRight float"*/}
                        {/*>*/}
                            {/*<FlexItem>DAY</FlexItem>*/}
                            {/*<FlexItem>EVENING</FlexItem>*/}
                            {/*<FlexItem>REST</FlexItem>*/}
                        {/*</Flex>*/}
                    {/*</div>*/}

                    {/*<div className="listDetails">*/}
                        {/*<div className="listLeft float">*/}
                            {/*<div className="people">*/}
                                {/*<span className="img"></span>*/}
                                {/*BEN.HUANG*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<Flex*/}
                            {/*className="listRight float"*/}
                        {/*>*/}
                            {/*<FlexItem>1</FlexItem>*/}
                            {/*<FlexItem>2</FlexItem>*/}
                            {/*<FlexItem>3</FlexItem>*/}
                        {/*</Flex>*/}
                    {/*</div>*/}

                    {/*<div className="listDetails">*/}
                        {/*<div className="listLeft float">*/}
                            {/*<div className="people">*/}
                                {/*<span className="img"></span>*/}
                                {/*BEN.HUANG*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<Flex*/}
                            {/*className="listRight float"*/}
                        {/*>*/}
                            {/*<FlexItem>1</FlexItem>*/}
                            {/*<FlexItem>2</FlexItem>*/}
                            {/*<FlexItem>3</FlexItem>*/}
                        {/*</Flex>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default PersonalGroup;