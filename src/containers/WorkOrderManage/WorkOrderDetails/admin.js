import './index.css';

import React,{Component} from 'react';
import { Flex,Modal,List,Radio,Button } from 'antd-mobile';
import { Link } from 'react-router-dom';

import Api from '../../../api/request';

import getState from '../../../utils/getState';
import FlightInfo from '../../../components/FlightInfo';

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;

class WorkDetailsAdmin extends Component {
    constructor(props){
        super(props);
        this.state = {

            modalType:false,
            valueType:'',
            fltid:'',
            engineer:'',
            modalData:[]
        };
    }

    componentWillMount(){
        Api.get('workorder/getFlightInfo',{acreg:'BLNC',flightdate:'2017-10-24'})
            .then(res => {
                console.log(res);
                this.setState({
                    modalData:res.data
                })
            });
    }


    onChange = (valueType,engineer,fltid) => {
        this.setState({
            valueType,
            engineer,
            fltid
            //modalType:false
        });
        //this.update();
    };

    modalType = _ => {
        this.setState({
            modalType:true
        });
    };

    relation = _ => {
        const { valueType,engineer,fltid } = this.state;
        console.log(valueType,engineer,fltid);
        this.setState({
            //modalType:false
        });
        Api.get('workorder/assignFlightnum',{fltid,engineer})
            .then(res => {
                console.log(res);
            })
    };

    render(){
        const {data} = this.props;
        let state = getState.state(data.taskcompletion);
        const { modalType,valueType,modalData } = this.state;
        return (
                <div data-name="workDetailsAdmin">
                    <div className="details-top">
                        <div className="details-work">
                            <div
                                className="work-list"
                            >
                                <span className="lv">{data.priority}</span>
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
                                                <p>{data.tasknum}</p>
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
                        </div>
                        <p
                            style={{color:'#333',textAlign:'center',height:'1rem',lineHeight:'1rem'}}
                            onClick={this.modalType}
                        >
                            点击关联航班</p>
                        <div className="details-relation">
                            Associated FLT
                        </div>
                        <FlightInfo data={data} />
                    </div>
                    <div className="details-bottom">

                        <div className="details-list">
                            <Link
                                to={{
                                    pathname: '/personnel_selection',
                                    search: '?sort=name'
                                }}
                            >
                                <div className="list-title">
                                    Assigned To
                                </div>
                                <div className="list-info">
                                    <div>8</div>
                                </div>
                            </Link>
                        </div>
                        <div className="details-list">
                            <div className="list-title">
                                MH
                            </div>
                            <div className="list-info">
                                <div>{data.mh}</div>
                            </div>
                        </div>
                        <div className="details-list" style={{borderBottom:0}}>
                            <div className="list-title">
                                Zone
                            </div>
                            <div className="list-info">
                                <div>{data.zone}</div>
                            </div>
                        </div>

                        <div className="details-description">
                            <p className="list-color2">Job Card Description</p>
                            <p>{data.jobcardDescription}</p>
                        </div>

                        <div className="details-list" style={{borderTop:0}}>
                            <div className="list-title">
                                Performer
                            </div>
                            <div className="list-info">
                                <div>{data.performer}</div>
                            </div>
                        </div>
                    </div>

                    <div className="details-action">
                        <Flex
                            justify="between"
                        >
                            <FlexItem>
                                <Link
                                    to={{
                                        pathname: '/deferral',
                                        state:data
                                    }}
                                >
                                    <div className="action">DEFERRING</div>
                                </Link>

                            </FlexItem>
                            <FlexItem>
                                <Link
                                    to={{
                                        pathname: '/handover',
                                        state:data
                                    }}
                                >
                                    <div className="action">HANDOVER</div>
                                </Link>
                            </FlexItem>
                            <FlexItem>
                                <Link
                                    to={{
                                        pathname: '/work_change'
                                    }}
                                >
                                    <div className="action">CHANGE</div>
                                </Link>
                            </FlexItem>
                        </Flex>
                    </div>

                    <Modal
                        visible={modalType}
                        transparent
                        onClose={this.modalTypeCancel}
                        className="modalSelect"
                    >
                        <List>
                            {
                                modalData.map(s =>
                                    <RadioItem
                                        key={`type${s.outaclogid}`}
                                        checked={valueType === s.outaclogid}
                                        onChange={() => this.onChange(s.outaclogid,s.engineer,s.fltid)}
                                    >
                                        {s.fltid}
                                    </RadioItem>
                                )
                            }
                            <Button
                                style={{width:'50%',margin:'.5rem auto 0'}}
                                onClick={this.relation}
                            >
                                OK</Button>
                        </List>
                    </Modal>
                </div>
        )
    }
}

export default WorkDetailsAdmin;