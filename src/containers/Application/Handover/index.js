import './index.css';

import React,{Component} from 'react';
import {createForm } from 'rc-form';
import { DatePicker,Modal } from 'antd-mobile';
import PersonnelSelection from '../../PersonnelSelection';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import WorkList from '../../../components/WorkList';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';

/*使用其他的标签作为时间的children*/
const DatePickerChildren = props => {
    return (
        <div
            onClick={props.onClick}
            style={{
                height: "19px",
                lineHeight: "24px"
            }}
        >
            {props.extra}
        </div>
    )
};

let nowDate = TimeConversion.date();
let personnelList = [];
//  默认值
const zhNow = moment(nowDate).locale('zh-cn').utcOffset(8);

class Handover extends Component {
    constructor(){
        super();
        this.state = {
            dpValue:zhNow,
            visible:false
        };
    }

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
        });
    };

    //  时间变化
    dateChange = _ => {
        console.log(_);
        const date = _._d;
        let nowDate = TimeConversion.TIME(date);
        this.setState({ dpValue: _ ,nowDate:nowDate});
    };

    personnelFn = list => {
        console.log(list)
    };

    showModal = _ => {
      this.setState({
          visible:true
      })
    };
    closeModal = _ => {
      this.setState({
          visible:false
      })
    };

    render(){
        const {dpValue,visible} = this.state;
        const { getFieldProps } = this.props.form;
        const data = this.props.location.state;
        return (
            <div>
                <Header title="Handover"/>
                <Content
                    style={{paddingBottom:'0'}}
                    className="padding"
                >
                    <div style={{paddingTop:'.3rem'}}>
                        <WorkList data={data}/>
                        <div className="from-input">
                            <from className="submit">
                                <div className="group-input">
                                    <span>FlightDate</span>
                                    <DatePicker
                                        mode="date"
                                        extra=""
                                        value = {dpValue}
                                        onChange={_ => this.dateChange(_)}
                                        {...getFieldProps('flightdate',{
                                            initialValue:dpValue,
                                            rules: [{ required: true}]
                                        })}
                                    >
                                        <DatePickerChildren></DatePickerChildren>
                                    </DatePicker>
                                </div>

                                <div className="group-input" onClick={this.showModal}>
                                    <span>PERSON</span>
                                    <input type="text" {...getFieldProps('arrflag',{
                                        initialValue:''
                                    })}
                                        style={{pointerEvents:'none'}}
                                    />
                                </div>

                                <div className="group-input">
                                    <p>Description</p>
                                    <textarea
                                        cols="30"
                                        rows="10"
                                        {...getFieldProps('Description')}
                                    ></textarea>
                                </div>

                                <div className="group-button">
                                    <div className="button" onClick={this.submit}>
                                        Submit
                                    </div>
                                </div>
                            </from>
                        </div>
                    </div>
                    <Modal
                        visible={visible}
                        animationType="slide"
                        style={{background:'red'}}
                    >
                        <PersonnelSelection
                            modal={true}
                            closeModal={this.closeModal}
                            personnelFn = {this.personnelFn}
                        />
                    </Modal>
                </Content>
            </div>
        )
    }
}
Handover = createForm()(Handover);
export default Handover;