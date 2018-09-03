import './index.less';
import './index.css';

import React,{Component} from 'react';
import { createForm } from 'rc-form';
import { Link } from 'react-router-dom';
import { DatePicker,Modal,List,Radio,ActivityIndicator} from 'antd-mobile';

import Api from '../../../api/request';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import LRUComponent from '../../../components/LRUComponent';
import DatePickerChildren from '../../../components/DatePickerChildren';
import PhonePhoto from '../../../components/photo';
import WorkListSTAFF from '../../../components/WorkListSTAFF';

import TimeConversion from '../../../utils/TimeConversion';
import moment from 'moment';

import { ACTYPE } from '../../../data';


const modalData = [
    { value: 'Y', label: 'ENDW' },
    { value: 'N', label: 'No Done' },
];

const RadioItem = Radio.RadioItem;

let nowDate = TimeConversion.date();

//  默认值
const zhNow = moment(nowDate).locale('zh-cn').utcOffset(8);

class JobFeedback extends Component {
    constructor(props){
        super(props);

        //let data = props.location.state.workOrder?props.location.state.workOrder:props.location.state;
	    let data = JSON.parse(props.location.search.replace('?',''));
	    let work = data.scanWorkOrderInfo || data.workOrder;

	    //console.log(data,work);

        //let workState = getState.state(work.taskcompletion?work.taskcompletion:'');

        let isLru = data.partInfo;

        this.state = {
            dpValue:zhNow,
            dpValue1:zhNow,
            valueType:{ value: 'Y', label: 'ENDW' },

	        isLru,

	        identity:Boolean(Number(localStorage.identity)),
            data,
	        //workState,
	        work,

	        loading:false,
	        update:false,

	        reasonModal:false,
	        reasonValue:{ DEFERCODE: '', DEFERDESC: ''},

	        reason:[],   //reason数据
        };

        this.url = 'workorder/feedbackAssignWork';

        this.tlbFiles = [];
        this.clbFiles = [];
        this.othersFiles = [];
    };

    componentWillMount(){

    };

    componentDidMount(){
    	//  获取reason数据源
	    Api.post('message/delay/reason')
		    .then(res => {
		    	//console.log(res);
		    	if (res.errorCode == 0) {
		    	    this.setState({
				        reason:res.data.reasonList
			        });
			    };
		    })
    };

	collect1 = (obj) => {
		//console.log(obj);
		this.tlbFiles = obj;
	};
	collect2 = (obj) => {
		//console.log(obj);
		this.clbFiles = obj;
	};
	collect3 = (obj) => {
		//console.log(obj);
		this.othersFiles = obj;
	};

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            //console.log(value);

            if (!error) {

            	this.setState({
		            loading:true
	            });

	            const { reasonValue,valueType } = this.state;

	            if ( valueType.value == 'Y') {
		            value.completiondate = value.completiondate._d?TimeConversion.TIME(value.completiondate._d):''
	            } else {
		            value.nodonereason = reasonValue.DEFERCODE;
	            };

	            value.taskcompletion = this.state.valueType.value;
	            //value.accomplishtime = TimeConversion.TIME(value.accomplishtime._d);
	            value.assignworkid = (this.state.work.assignworkid).toString();

	            console.log(value);

	            if (window.plus) {

		            plus.uploader.enumerate((a,b)=>{
			            console.log(JSON.stringify(a),'---',b);
		            });

		            let task = plus.uploader.createUpload(httpRequest + this.url, {
			            method: "POST",
			            timeout:60
		            },(t, status) => {
						console.log(JSON.stringify(t));
						console.log(JSON.stringify(t.responseText));
						let res = JSON.parse(t.responseText);
						console.log(res.errorCode);
			            if (status == 200) {
			            	if ( res.errorCode == 0 ) {
					            Modal.alert('Success','',[{text:'OK',onPress:()=> this.props.history.go(-2)}]);
				            } else {
					            Modal.alert(res.errorMsg);
				            };
			            } else {
				            Modal.alert('error');
				            console.log("上传失败");
			            };

			            this.setState({
				            loading:false
			            });

			            plus.uploader.clear();
		            });

		            Object.keys(value).map(s=>{
			            task.addData(s,(value[s] || ''));
			            console.log(value[s] || '');

		            });

		            task.addData("apptoken",localStorage.token);
		            task.addData("userAccount",localStorage.userAccount);

		            console.log(JSON.stringify(task));

		            this.tlbFiles.length > 0?this.tlbFiles.map((s,v)=>
			            task.addFile(s.src,{key:`tlb_photo`+(v+1)})
		            ):null;

		            this.clbFiles.length > 0?this.clbFiles.map((s,v)=>
			            task.addFile(s.src,{key:`clb_photo`+(v+1)})
		            ):null;

		            this.othersFiles.length > 0?this.othersFiles.map((s,v)=>
			            task.addFile(s.src,{key:`others_photo`+(v+1)})
		            ):null;

		            task.start();

	            } else {

		            Api.post(this.url,value)
			            .then(res => {

				            console.log(res.errorCode);

				            if (res.errorCode == 0) {
					            Modal.alert('Success','',[{text:'OK',onPress:()=> this.props.history.go(-2)}]);
				            } else {
					            Modal.alert('Fill error');
				            };

				            this.setState({
					            loading:false
				            });
			            })
	            };

            } else {
            	console.log(error);
            	if ( error.nodonereason ) {
            	    Modal.alert('No Done Reason is required');
	            };
            }
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

    /*完成或者未完成*/
    onChange = (e,valueType) => {
    	e.preventDefault();
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
    modalTypeCancel = e => {
        e.preventDefault();
        this.setState({
            modalType:false
        });
    };

	onChange1 = (e,reasonValue) => {
		e.preventDefault();

		this.props.form.setFieldsValue({
			nodonereason:reasonValue.DEFERDESC
		});


		this.setState({
			reasonValue,
			reasonModal:false
		});
	};

	modalType1 = e => {
		e.preventDefault();
		this.setState({
			reasonModal:true
		});
	};

	modalTypeCancel1 = _ => {
		this.setState({
			reasonModal:false
		});
	};

    render(){
        const { modalType,
	        valueType,
	        data,work,
	        isLru,dpValue,
	        loading,
	        reasonValue
        } = this.state;
        const { getFieldProps } = this.props.form;

        //console.log(valueType.value,this.state.reasonValue);

        return (
	        <Content
		        style={{
		        	paddingBottom:0
		        }}
	        >
		        <Header title="Feedback">
			        <div
				        onClick={ ()=> this.props.history.replace(`/scanning?${work.plandate || work.assigndate},${work.barcode}`)}
				        className="icon icon-scanning"
				        style={{left:'auto',right:'0'}}
			        >

			        </div>
		        </Header>

		        <ActivityIndicator
			        toast
			        text="Loading..."
			        animating={ loading }
		        />

		        <div style={{padding:'.3rem'}}>
			        <WorkListSTAFF data={work}/>

			        <div className="from-input">
				        <from className="submit">

					        <label
						        className="group-input"
						        onClick={ _=>this.modalType(_) }
					        >
						        <div className="icon icon-list-"></div>
						        <span>Completion</span>
						        <input
							        style={{
								        paddingLeft: '1.5rem',
								        background:'transparent'
							        }}
							        disabled
							        type="text" {...getFieldProps('taskcompletion',{
							        initialValue:valueType.label,
						        })}/>
					        </label>

					        {
						        valueType.value == 'Y'?
							        <div className="endw">
								        <label className="group-input">
									        <span>AccomplishDate</span>
									        <DatePicker
										        mode="date"
										        extra=""
										        onChange={_ => this.dateChange(_)}
										        {...getFieldProps('completiondate',{
											        initialValue:dpValue,
										        })}
									        >
										        <DatePickerChildren
											        style={{
												        height: ".5rem",
												        paddingLeft: '2rem'
											        }}
										        ></DatePickerChildren>
									        </DatePicker>
								        </label>

								        <label className="group-input">
									        <span>Hours</span>
									        <input type="number"
									               min={`0`}
									               {...getFieldProps('menhours',{
										               initialValue:work.menhours?
											               work.menhours:'',
									               })}/>
								        </label>

								        <label className="group-input">
									        <span>Tlbpage</span>
									        <input type="text"
									               maxLength={100}
									               {...getFieldProps('tlbpage',{
										               initialValue:'',
									               })}/>
								        </label>

								        {/*<label className="group-input">*/}
									        {/*<span>左发滑油量</span>*/}
									        {/*<input type="number"*/}
									               {/*{...getFieldProps('eng1',{*/}
										               {/*initialValue:work.tlbpage?*/}
											               {/*work.tlbpage:'',*/}
									               {/*})}/>*/}
								        {/*</label>*/}

								        {/*<label className="group-input">*/}
									        {/*<span>右发滑油量</span>*/}
									        {/*<input type="number"*/}
									               {/*{...getFieldProps('eng2',{*/}
										               {/*initialValue:'',*/}
									               {/*})}/>*/}
								        {/*</label>*/}

								        {/*<label className="group-input">*/}
									        {/*<span>Apu滑油量</span>*/}
									        {/*<input type="number"*/}
									               {/*{...getFieldProps('apu',{*/}
										               {/*initialValue:'',*/}
									               {/*})}/>*/}
								        {/*</label>*/}

								        <label className="group-input">
									        <span>Remarks</span>
									        <input type="text"
									               maxLength={2000}
									               {...getFieldProps('remarks',{
										               initialValue:work.remarks?
											               work.remarks:'',
									               })}/>
								        </label>

							        </div>
							        :
							        <div className="no">
								        {/*<label className="group-input">*/}
									        {/*<span>左发滑油量</span>*/}
									        {/*<input type="number"*/}
									               {/*{...getFieldProps('eng1',{*/}
										               {/*initialValue:work.tlbpage?*/}
											               {/*work.tlbpage:'',*/}
									               {/*})}/>*/}
								        {/*</label>*/}

								        {/*<label className="group-input">*/}
									        {/*<span>右发滑油量</span>*/}
									        {/*<input type="number"*/}
									               {/*{...getFieldProps('eng2',{*/}
										               {/*initialValue:'',*/}
									               {/*})}/>*/}
								        {/*</label>*/}

								        {/*<label className="group-input">*/}
									        {/*<span>Apu滑油量</span>*/}
									        {/*<input type="number"*/}
									               {/*{...getFieldProps('apu',{*/}
										               {/*initialValue:'',*/}
									               {/*})}/>*/}
								        {/*</label>*/}

								        <label
									        className="group-input"
									        onClick={ e=>this.modalType1(e) }
								        >
									        <div className="icon icon-list-"></div>
									        <p>No Done Reason</p>
									        <input
										        style={{
											        padding: '0',
											        background:'transparent'
										        }}
										        disabled
										        type="text" {...getFieldProps('nodonereason',{
											        initialValue:reasonValue.DEFERDESC,
											        rules:[{required:true}]
									            })}
									        />
								        </label>

								        <label
									        className="group-input"
									        style={{padding:0}}
								        >
									        <div style={{
										        padding: '.2rem .25rem'
									        }}>
										        <p>No Done Detail</p>
										        <textarea
											        cols="30"
											        rows="10"
											        maxLength={1000}
											        style={{
												        width:'100%'
											        }}
											        {...getFieldProps('nodonedetail')}
										        ></textarea>
									        </div>
								        </label>

							        </div>
					        }

					        <label
						        className="group-input"
						        style={{padding:0}}
					        >
						        <div style={{
							        padding: '.2rem .25rem'
						        }}>
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

						        <div className="photo-group">
							        <p className="title">TLB</p>
							        <PhonePhoto fn={this.collect1}/>
						        </div>
						        <div className="photo-group">
							        <p className="title">CLB</p>
							        <PhonePhoto fn={this.collect2}/>
						        </div>
						        <div className="photo-group">
							        <p className="title">OTHER</p>
							        <PhonePhoto fn={this.collect3}/>
						        </div>
					        </label>

					        {/*{暂时去掉*/}
						        {/*isLru?<LRUComponent data={data} isLru = {isLru}/>:null*/}
					        {/*}*/}

					        <div className="group-button">
						        <div className="button" onClick={this.submit}>
							        Submit
						        </div>
					        </div>
				        </from>

			        </div>
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
							        key={`type${v}`}
							        checked={valueType.value === s.value}
							        onChange={(e) => this.onChange(e,s)}
						        >
							        {s.label}
						        </RadioItem>
					        )
				        }

			        </List>
		        </Modal>

		        <Modal
			        visible={this.state.reasonModal}
			        transparent
			        onClose={this.modalTypeCancel1}
			        className="modalSelect"
		        >
			        <List>
				        {
					        this.state.reason.length == 0?
					        <ActivityIndicator />
					        :this.state.reason.map((s,v) =>
						        <RadioItem
							        key={s.DEFERCODE}
							        checked={this.state.reasonValue.DEFERCODE === s.DEFERCODE}
							        onChange={(e) => this.onChange1(e,s)}
						        >
							        {s.DEFERDESC}
						        </RadioItem>
					        )
				        }
			        </List>
		        </Modal>

	        </Content>
        )
    }
}

JobFeedback = createForm()(JobFeedback);
export default JobFeedback;