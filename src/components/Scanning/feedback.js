
import React,{Component} from 'react';
import {createForm } from 'rc-form';
import { DatePicker,Modal,List,Radio,ActivityIndicator} from 'antd-mobile';

import Api from '../../api/request';
import Native from '../../utils/Native';

import Header from '../../components/Header';
import Content from '../../components/Content';
import LRUComponent from '../../components/LRUComponent';
import DatePickerChildren from '../../components/DatePickerChildren';

import getState from '../../utils/getState';
import TimeConversion from '../../utils/TimeConversion';
import moment from 'moment';


const modalData = [
	{ value: 'Y', label: 'ENDW' },
	{ value: 'N', label: 'N' },
];
const RadioItem = Radio.RadioItem;

class ScaJobFeedback extends Component {
    constructor(props){
        super(props);
        console.log(props);
        let props_data = props.location.search.replace('?','').split(',');
		let barcode = props_data[0];
		let assigndate = props_data[1];

		barcode = 'WOPPC18000054_3';
	    assigndate = '2018-03-13';

        let zhNow1 = moment(assigndate).locale('zh-cn').utcOffset(8);
        this.state = {
            dpValue:'',
            dpValue1:zhNow1,
	        valueType:{ value: 'Y', label: 'ENDW' },

			barcode,
			assigndate,

	        isLru:false,

			isRequest:true,
			feedbacked:false,
			data:null
        };
    };

    componentDidMount(){
    	//return;

		let {barcode,assigndate} = this.state;
		Api.get('workorder/getScanWorkOrder',{ barcode,assigndate })
			.then(res=> {
				let feedbacked = false;
				let isLru = false;
				if (res.errorCode == 0) {
					if(res.data.scanWorkOrderInfo) {
						if (res.data.scanWorkOrderInfo.taskcompletion == "N" || res.data.scanWorkOrderInfo.taskcompletion == "Y") {
							console.log('已经反馈');
							Native.alert('Feedback');
							isLru = res.data.partInfo ? res.data.partInfo : false;
						} else {
							if (!res.data.scanWorkOrderInfo.engineer) {
								console.log(JSON.stringify(res) + barcode + assigndate);
								Native.alert('Unassigned');
							} else {
								isLru = res.data.scanWorkOrderInfo.partInfo ? res.data.scanWorkOrderInfo.partInfo : false;
								feedbacked = true;
								console.log('可以反馈');
							}
						}
						this.setState({
							isRequest:false,
							feedbacked,
							isLru,
							data:res.data.scanWorkOrderInfo,
							dpValue:moment(res.data.scanWorkOrderInfo.completiondate).locale('zh-cn').utcOffset(8)
						});
					}else {
						this.setState({
							isRequest:false,
						});
						Native.alert('The data does not exist, please choose the right time');
					}

				}else {
					this.setState({
						isRequest:false,
					});
					Native.alert('error');
				}

			});
    };

    componentWillUnmount(){
    	this.setState = () => {};
    }

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
	            value.taskcompletion = this.state.valueType.value;
                value.completiondate = value.completiondate._d?TimeConversion.TIME(value.completiondate._d):'';
                //value.accomplishtime = TimeConversion.TIME(value.accomplishtime._d);
                value.assignworkid = this.state.data.assignworkid;
                Api.post('workorder/feedbackAssignWork',value)
                    .then(res => {
                        console.log(res.errorCode);
                        if (res.errorCode == 0) {
	                        Native.alert('Success',()=>this.props.history.goBack());
                        } else {
                            Native.alert('Fill error');
                        }
                    })
            };
        });
    };

    //  时间变化
    dateChange = _ => {
        this.setState({ dpValue: _ });
    };

    //  时间变化1
    dateChange1 = _ => {
        this.setState({ dpValue1: _ });
    };

    onChange = (valueType) => {
        this.setState({
            valueType,
            modalType:false
        });
    };

    modalType = e => {
        e.preventDefault();
        this.setState({
            modalType:true
        });
    };
    modalTypeCancel = _ => {
        //e.preventDefault();
        this.setState({
            modalType:false
        });
    };

    render(){
        const { dpValue,dpValue1,
	        modalType,valueType,
	        isRequest,data,isLru,
	        barcode,feedbacked } = this.state;
        const { getFieldProps } = this.props.form;
        let state = getState.state(data?data.taskcompletion:'');
        return (
            <div>
                <Header title={barcode}/>
                <Content
                    className="padding"
                >
					{
						isRequest?<ActivityIndicator />:
							data?<div style={{paddingTop:'.3rem'}}>
								<div
									className="work-list"
								>
									<span className="lv">{data.priority?data.priority:'C'}</span>
									<div className={`state ${state}`}>
										<div></div>
										<p>{state}</p>
									</div>
									<div className="list-top">
										<div className="introduction">
											<p className="title">{data.barcode}</p>
											<p className="list-color1">Assigned Date: {data.assigndate}</p>
											<p className="list-color1">DueDate: {data.duedate}</p>
										</div>
									</div>
									<div className="list-bottom">
										<p className="list-color2">{data.jobcarddescription?data.jobcarddescription:'nothing'}</p>
									</div>
								</div>

								<div className="from-input">
									<from className="submit">
										<div className="group-input"
											// onClick={_=>this.modalType(_)}
										>
											<span>Completion</span>
											<input
												style={{
													paddingLeft: '1.5rem',
													background:'transparent'
												}}
												disabled
												type="text" {...getFieldProps('taskcompletion',{
												initialValue:data.taskcompletion?
													data.taskcompletion:
													valueType.label,
											})}/>
										</div>

										<div className="group-input">
											<span>AccomplishDate</span>
											<DatePicker
												mode="date"
												extra=""
												onChange={_ => this.dateChange(_)}
												{...getFieldProps('completiondate',{
													initialValue:data.completiondate?
														dpValue:'',
												})}
											>
												<DatePickerChildren
													style={{
														height: ".5rem",
														paddingLeft: '.65rem'
													}}
												></DatePickerChildren>
											</DatePicker>
										</div>

										{/*<div className="group-input">*/}
											{/*<span>FeedbackDate</span>*/}
											{/*<DatePicker*/}
												{/*mode="date"*/}
												{/*extra=""*/}
												{/*value = {dpValue1}*/}
												{/*onChange={_ => this.dateChange1(_)}*/}
												{/*{...getFieldProps('accomplishtime',{*/}
													{/*initialValue:data.accomplishtime?*/}
														{/*data.accomplishtime:dpValue1,*/}
													{/*rules: [{ required: true}]*/}
												{/*})}*/}
											{/*>*/}
												{/*<DatePickerChildren></DatePickerChildren>*/}
											{/*</DatePicker>*/}
										{/*</div>*/}

										<div className="group-input">
											<span>Hours</span>
											<input type="number"
											       min={`0`}
												   {...getFieldProps('menhours',{
													   initialValue:data.menhours?
														   data.menhours:'',
												   })}/>
										</div>

										{/*-----------------------------*/}

										<div className="group-input">
											<span>tlbpage</span>
											<input type="text"
												   maxLength={100}
												   {...getFieldProps('tlbpage',{
													   initialValue:data.tlbpage?
														   data.tlbpage:'',
												   })}/>
										</div>

										<label className="group-input">
											<span>左发滑油量</span>
											<input type="number"
											       {...getFieldProps('eng1',{
												       initialValue:'',
											       })}/>
										</label>

										<label className="group-input">
											<span>右发滑油量</span>
											<input type="number"
											       {...getFieldProps('eng2',{
												       initialValue:'',
											       })}/>
										</label>

										<label className="group-input">
											<span>Apu滑油量</span>
											<input type="number"
											       {...getFieldProps('apu',{
												       initialValue:'',
											       })}/>
										</label>

										<div className="group-input">
											<span>remarks</span>
											<input type="text"
												   maxLength={2000}
												   {...getFieldProps('remarks',{
													   initialValue:data.remarks?
														   data.remarks:'',
												   })}/>
										</div>

										{/*<div className="group-input">*/}
											{/*<span>reason</span>*/}
											{/*<input type="text"*/}
												   {/*maxLength={2000}*/}
												   {/*{...getFieldProps('nodonereason',{*/}
													   {/*initialValue:data.nodonereason?*/}
														   {/*data.nodonereason:'',*/}
												   {/*})}/>*/}
										{/*</div>*/}

										{/*<div className="group-input">*/}
											{/*<span>hrsign</span>*/}
											{/*<input type="text"*/}
												   {/*maxLength={1}*/}
												   {/*{...getFieldProps('hrsign',{*/}
													   {/*initialValue:data.hrsign?*/}
														   {/*data.hrsign:'',*/}
												   {/*})}/>*/}
										{/*</div>*/}

										<div className="group-input">
											<p>Feedbacknote</p>
											<textarea
												cols="30"
												rows="10"
												maxLength={1000}
												style={{
													width:'100%'
												}}
												{...getFieldProps('feedbacknote')}
											></textarea>
										</div>

										{
											isLru?<LRUComponent data={data} isLru = {isLru}/>:null
										}

										{
											feedbacked?
												<div className="group-button">
													<div className="button" onClick={this.submit}>
														Submit
													</div>
												</div>
											:null
										}

									</from>
								</div>
							</div>:<div className="noData hasPadding">No Data</div>

					}

                    <Modal
                        visible={modalType}
                        transparent
                        onClose={this.modalTypeCancel}
                        className="modalSelect"
                    >
                        <List>
                            {
                                modalData.map((s,v) =>
	                                <RadioItem key={`type${v}`}
	                                           checked={valueType.value === s.value}
	                                           onChange={() => this.onChange(s)}
	                                >
		                                {s.label}
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

ScaJobFeedback = createForm()(ScaJobFeedback);
export default ScaJobFeedback