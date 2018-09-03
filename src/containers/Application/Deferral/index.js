import './index.css';

import React,{Component} from 'react';
import {createForm } from 'rc-form';
import { DatePicker,Modal,List,Radio,ActivityIndicator } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import WorkListADMIN from '../../../components/WorkListADMIN';
import WorkListSTAFF from '../../../components/WorkListSTAFF';
import DatePickerChildren from '../../../components/DatePickerChildren';

import Api from '../../../api/request';
import Native from '../../../utils/Native';
import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';

const RadioItem = Radio.RadioItem;

class Deferral extends Component {
    constructor(props){
        super(props);
	    let nowDate = TimeConversion.date();
        //  默认值
	    let zhNow = moment(nowDate).locale('zh-cn').utcOffset(8);
        let assignworkid = props.location.search.replace('?','');
        let data = props.location.state;
        this.state = {
            dpValue:zhNow,
			assignworkid,
			data,

            reasonModal:false,
            reasonValue:{},
            reasonData:[]
        };

        this.reasonUrl = 'message/delay/reason';
    };

    componentWillMount(){
        Api.post(this.reasonUrl,{})
            .then(res => {
                //console.log(res);
                let reasonData = res.data.reasonList;
                this.setState({
	                reasonData
                });
            })
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                Native.showWaiting();
                value.plancdate = TimeConversion.TIME(value.plancdate._d);
                value.assignworkid = this.state.assignworkid;
                value.tasknum = this.state.data.taskno;
                value.delayreason = this.state.reasonValue.DEFERDESC;
				//console.log(value);
                Api.post('workorder/applyDelayWork',value)
                    .then(res => {
                        Native.closeWaiting();
                        if (res.errorCode == 0) {
                            if (res.data.status == 2) {
                                Native.alert('Being examined and approved');
                                return;
                            };
	                        Native.alert('Success',()=>this.props.history.goBack());
                        } else {
                            Native.alert('Fill error');
                        }
                    })
            } else {
	            let array = [];
	            for (let i in error) {
		            array.push({...error[i].errors[0]});
	            };
	            console.log(array[0].message);
	            Native.alert(array[0].message);
            };
        });
    };

    //  时间变化
    dateChange = _ => {
        //console.log(_);
        const date = _._d;
        let nowDate = TimeConversion.TIME(date);
        this.setState({ dpValue: _ ,nowDate:nowDate});
    };

	modalType = e => {
		e.preventDefault();
		this.setState({
			reasonModal:true
		});
	};
	modalTypeCancel = _ => {
		this.setState({
			reasonModal:false
		});
	};

	radioChange = (e,reasonValue) => {
		e.preventDefault();
		this.setState({
			reasonValue,
			reasonModal:false
		});
	};

    render(){
        const {
            dpValue,data,
            reasonModal,reasonValue,reasonData
        } = this.state;
        const { getFieldProps } = this.props.form;
        let identity = Boolean(Number(localStorage.identity));
        return (
            <div>
                <Header title="DEFERRAL"/>
                <Content
                    style={{paddingBottom:'0'}}
                    className="padding"
                >
                    <div style={{paddingTop:'.3rem'}}>
                        {
                            identity?<WorkListADMIN data={data} />:
	                            <WorkListSTAFF data={data} />
                        }

                        <div className="from-input">
                            <from className="submit">

                                <div className="group-input">
                                    <span>Accomplished Before</span>
                                    <DatePicker
                                        mode="date"
                                        extra=""
                                        value = {dpValue}
                                        onChange={_ => this.dateChange(_)}
                                        {...getFieldProps('plancdate',{
                                            initialValue:dpValue,
                                            rules: [{ required: true}]
                                        })}
                                    >
                                        <DatePickerChildren
                                            style={{
	                                            lineHeight:'inherit',
		                                        paddingLeft:'2.4rem'
	                                        }}
                                        />
                                    </DatePicker>
                                </div>

                                <label
                                    onClick={e => this.modalType(e)}
                                >
                                    <div className="group-input">
                                        <div className="icon icon-list-"></div>
                                        <span>DelayReason</span>
                                        <input
                                            type="text"
                                            className="disabled"
                                            disabled
                                            style={{
                                            	paddingLeft:'1.6rem'
                                            }}
			                                {...getFieldProps('delayreason',{
				                                initialValue:reasonValue.DEFERDESC?
					                                reasonValue.DEFERDESC:'',
				                                rules: [{ required: true}]
			                                })}/>
                                    </div>
                                </label>

                                <div className="group-input">
                                    <p>NO Done Detail</p>
                                    <textarea
                                        cols="30"
                                        rows="10"
		                                {...getFieldProps('delaydetail',{
			                                rules: [{ required: true}]
		                                })}
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
                        visible={ reasonModal }
                        transparent
                        onClose={ this.modalTypeCancel }
                        className="modalSelect"
                        style={{
                            width:'90%'
                        }}
                    >
                        <List>
			                {
				                reasonData.length == 0?
                                    <ActivityIndicator />:
					                reasonData.map((s,v)=>
                                        <RadioItem
                                            key={ s.DEFERCODE }
                                            checked={ reasonValue.DEFERCODE === s.DEFERCODE }
                                            onChange={ e => this.radioChange(e,s)}
                                        >
                                            { s.DEFERDESC }
                                        </RadioItem>
				                )
			                }
                        </List>
                    </Modal>

                </Content>
            </div>
        )
    }
}
Deferral = createForm()(Deferral);
export default Deferral;