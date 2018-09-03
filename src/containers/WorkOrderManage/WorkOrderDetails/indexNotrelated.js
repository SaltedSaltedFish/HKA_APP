import './index.css';

import React,{Component} from 'react';
import { Flex ,Modal,List, InputItem,ActivityIndicator,Radio,Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import { Link } from 'react-router-dom';

import getState from '../../../utils/getState';
import FlightInfo from '../../../components/FlightInfo';
import Api from '../../../api/request';
import Native from '../../../utils/Native';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Footer from '../../../components/Footer';

import WorkDetailsAdmin from './admin';
import WorkDetailsStaff from './staff';

const FlexItem = Flex.Item;
const alert = Modal.alert;
const prompt = Modal.prompt;
const RadioItem = Radio.RadioItem;


let set,woid,acreg,flightdate;
class WorkDetails extends Component {
    constructor(props){
        super(props);
        let data = props.location.state;
        this.state = {
            data,
            hours:false,
            moneyfocused:false,
            isRequest:true,

            modalType:false,
            valueType:'',
            fltid:'',
            engineer:'',
            modalData:[]
        };
        let array = props.location.search.replace('?woid=','').split('&');
        //console.log(array);
        acreg = array[2];
        flightdate = array[1];
        woid = array[0];
    }

    componentWillMount(){
        console.log(this.props);
        Api.get('workorder/getFlightInfo',{acreg:acreg,flightdate:flightdate})
            .then(res => {
                console.log(res);
                this.setState({
                    modalData:res.data,
                    isRequest:false
                })
            });
    }

    componentWillUnmount(){
        clearTimeout(set);
        this.setState = _ => {};
    };

    onClose = _ => {
      this.setState({
          hours:false
      })
    };

    onChange = (valueType,engineer,fltid) => {
        this.setState({
            valueType,
            engineer,
            fltid
            //modalType:false
        });
    };

    relation = _ => {
        const { valueType,engineer,fltid } = this.state;
        console.log(valueType,engineer,fltid,woid);
        this.setState({
            modalType:false
        });
        if (fltid == '') {
            Native.alert('Please Select flights');
        } else {
            Api.get('workorder/assignFlightnum',{fltid,engineer,woid})
                .then(res => {
                    if (res.errorCode == 0) {
                        Native.alert('Association success');
                    } else {
						Native.alert(res.errorMsg);
                    }
                })
        }
    };

    render(){
        const {isRequest} = this.state;
        const { modalType,valueType,modalData } = this.state;
        //let state = getState.state(data.taskcompletion?data.taskcompletion:'');
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="工单详情"/>

                {
                    isRequest?<ActivityIndicator/>:

                        <div>
                            <div data-name="workDetailsAdmin">
                                <div className="details-top">
                                    {/*<div className="details-work">*/}
                                        {/*<div*/}
                                            {/*className="work-list"*/}
                                        {/*>*/}
                                            {/*/!*<span className="lv">{s.priority?s.priority:'C'}</span>*!/*/}
                                            {/*<div className={`state ${state}`}>*/}
                                                {/*<div></div>*/}
                                                {/*<p>{state}</p>*/}
                                            {/*</div>*/}
                                            {/*<div className="list-top" style={{border:'none'}}>*/}
                                                {/*<div className="introduction">*/}
                                                    {/*<p className="title">{data.wono}</p>*/}
                                                    {/*<p className="list-color1">Acreg：{data.acreg} </p>*/}
                                                {/*</div>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*</div>*/}
                                    <div className="details-relation">
                                        Associated FLT
                                    </div>
                                    <List>
                                        {
                                            modalData.map((s,v) =>
                                                <RadioItem
                                                    key={v}
                                                    checked={valueType === s.aclogid}
                                                    onChange={() => this.onChange(s.aclogid,s.engineer,s.fltid)}
                                                >
                                                    {s.fltid}
                                                </RadioItem>
                                            )
                                        }
                                    </List>
                                </div>

                                <Modal
                                    visible={modalType}
                                    transparent
                                    onClose={this.modalTypeCancel}
                                    className="modalSelect"
                                >
                                    <List>
                                        {
                                            modalData.map((s,v) =>
                                                <RadioItem
                                                    key={v}
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
                                            OK
                                        </Button>
                                    </List>
                                </Modal>
                            </div>
                        </div>
                }

                <Footer>
                    <div
                        onClick={this.relation}
                    >
                        Submit
                    </div>
                </Footer>
            </Content>
        )
    }
}
WorkDetails = createForm()(WorkDetails);
export default WorkDetails;