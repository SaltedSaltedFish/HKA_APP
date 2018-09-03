import './index.css';

import React,{ Component } from 'react';
import {createForm } from 'rc-form';
import { connect } from 'react-redux';
import { DatePicker,Modal,List,Radio } from 'antd-mobile';

//import { eliminate } from '../../../actions/arriveals';

import TimeConversion from '../../../utils/TimeConversion';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import DatePickerChildren from '../../../components/DatePickerChildren';
import { TimeCHOICE } from '../../../components/TimeChoice';

import moment from 'moment';

class FlightSearch extends Component {

    constructor(props){
        super(props);
        //  默认值
        const zhNow = moment(props.location.search.replace('?','')).locale('zh-cn').utcOffset(8);

        this.state = {
            dpValue:zhNow,
	        flagModal:false,
	        flagValue:{
		        label:'',
		        value:''
	        },

	        flightdate1:props.location.search.replace('?','') || '',
	        flightdate2:props.location.search.replace('?','') || ''
        };

        this.inputArray = [
            {
	            label:'ETA-START',
                title:'预计到港开始时间',
                name:'eta1',
                num:0,
            },{
		        label:'ETA-END',
                title:'预计到港结束时间',
                name:'eta2',
		        num:1,
            },{
		        label:'ATA-START',
                title:'实际到港开始时间',
                name:'ata1',
		        num:0,
            },{
		        label:'ATA-END',
                title:'实际到港结束时间',
                name:'ata2',
		        num:1,
            },{
		        label:'ETD-START',
                title:'预计离港开始时间',
                name:'etd1',
		        num:0,
            },{
		        label:'ETD-END',
                title:'预计离港结束时间',
                name:'etd2',
		        num:1,
            },{
		        label:'ATD-START',
                title:'实际离港开始时间',
                name:'atd1',
		        num:0,
            },{
		        label:'ATD-END',
                title:'实际离港结束时间',
                name:'atd2',
		        num:1,
            }
        ];

        this.taskData = [
	        {
		        label:'离开',
		        value:'1'
	        },{
		        label:'到达',
		        value:'0'
	        },{
        	    label:'全部',
		        value:''
	        }
        ];
    };

    componentDidMount(){
	    sessionStorage.removeItem('SearchCondition');
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            if(!error) {

	            //value.flightdate = TimeConversion.TIME(value.flightdate);

	            let start = null,
		            end = null,
	                isCorrect = true;
                let time;

                const { flightdate1,flightdate2 } = this.state;

	            if (TimeConversion.getTime(flightdate1) > TimeConversion.getTime(flightdate2)) {
	            	Modal.alert('','Please check the start and end time');
	            	return;
	            };

                value.flightdate1 = flightdate1;
	            value.flightdate2 = flightdate2;
	            value.acreg = value.acreg.toUpperCase();
	            value.fltid = value.fltid.toUpperCase();

                this.inputArray.map((s,v) => {
                    //console.log(v,v%2,Boolean(v%2));

	                if ( value[s.name]._d ) {
                        if ( s.num == 0 ) {
                            start = TimeConversion.getTime(value[s.name]._d);
	                        time = value.flightdate1 + ' '
		                        + TimeConversion.format(value[s.name]._d.getHours())
		                        + ':'
		                        + TimeConversion.format(value[s.name]._d.getMinutes());
                        } else if (s.num == 1) {
                            end = TimeConversion.getTime(value[s.name]._d);
	                        time = value.flightdate2 + ' '
		                        + TimeConversion.format(value[s.name]._d.getHours())
		                        + ':'
		                        + TimeConversion.format(value[s.name]._d.getMinutes());
                        };

		                //console.log(start,end);

		                if (start && end && start > end ) {
		                    //console.log(s.label + '时间选择有误');
		                    Modal.alert('',s.label + 'Time selection is wrong');
			                isCorrect = false;
                        };

		                if (Boolean(v%2)) {
			                start = null;
			                end = null;
		                };
                    } else {
	                    time = '';
                    };

	                value[s.name] = time;
                });

                value.arrflag = this.state.flagValue.value;
                //value.userFlag = localStorage.identity;
	            value.userFlag = '1';

	            if ( !isCorrect ) {
		            return;
	            };

	            //console.log(value);
	            
                this.props.history.replace({
                    pathname: '/search_list',
                    state: value
                });
            }
        });
    };

    //  时间变化
    dateChange = _ => {
        //console.log(_);
        const date = _._d;
        let nowDate = TimeConversion.TIME(date);
        this.setState({ dpValue: _ ,nowDate:nowDate});
    };

    //  选择
	modalType = e => {
		e.preventDefault();
		this.setState({
			flagModal:true
		});
	};

	modalTypeCancel = _ => {
		this.setState({
			flagModal:false
		});
	};

	onChange = (e,flagValue) => {
		e.preventDefault();
		this.setState({
			flagValue,
			flagModal:false
		});
	};

    render(){
        const { getFieldProps } = this.props.form;
        const { dpValue,flagValue,flagModal,flightdate1,flightdate2 } = this.state;
        const { flightState } = this.props;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="FLT SEARCH"/>

                <div className="from-input" style={{padding:'.3rem'}}>
                    <from className="submit">
                        <label className="group-input">
                            <span>FlightNo</span>
                            <input className="uppercase" type="text" {...getFieldProps('fltid',{
                                initialValue:''
                            })}/>
                        </label>

                        <label className="group-input">
                            <span>ACREG</span>
                            <input className="uppercase" type="text" {...getFieldProps('acreg',{
                                initialValue:''
                            })}/>
                        </label>

	                    <label
		                    className="group-input"
		                    onClick={e => this.modalType(e)}
	                    >
		                    <div className="icon icon-list-"></div>
		                    <span>ARRFLAG</span>
		                    <input
			                    className="disabled"
			                    disabled
			                    type="text" {...getFieldProps('arrflag',{
			                    initialValue:flagValue.label
		                    })}/>
	                    </label>

	                    <label className="group-input">
		                    <span>GATE</span>
		                    <input type="text" {...getFieldProps('gate',{
			                    initialValue:''
		                    })}
                            placeholder={`机位`}
		                    />
	                    </label>

	                    <label className="group-input">
		                    <span>DEPSTN</span>
		                    <input type="text" {...getFieldProps('depstn',{
			                    initialValue:''
		                    })}
			                    placeholder={`出发站`}
		                    />
	                    </label>

	                    <label className="group-input">
		                    <span>ARRSTN</span>
		                    <input type="text" {...getFieldProps('arrstn',{
			                    initialValue:''
		                    })}
	                           placeholder={`到达站`}
		                    />
	                    </label>

	                    <label className="group-input">
		                    <span>STATUS</span>
		                    <input type="text" {...getFieldProps('status',{
			                    initialValue:''
		                    })}
                            placeholder={`状态如：SCH`}
		                    />
	                    </label>

                        <div className="group-input input-date">
                            <span>FlightStart</span>
	                        <TimeCHOICE
		                        nowDate={flightdate1}
		                        fn={(obj) => this.setState({
			                        flightdate1:obj.nowDate
		                        })}
		                        extra='开始时间'
	                        />
                        </div>

	                    <div className="group-input input-date">
		                    <span>FlightEnd</span>
		                    <TimeCHOICE
			                    nowDate={flightdate2}
			                    fn={(obj) => this.setState({
				                    flightdate2:obj.nowDate
			                    })}
			                    extra='截止时间'
		                    />
	                    </div>

                        {
                            this.inputArray.map(s=>
                                <div
                                    key={s.name}
                                    className="group-input input-date"
                                >
                                    <span>{s.label}</span>
                                    <DatePicker
                                        mode="time"
                                        extra={s.title}
                                        onChange={_ => this.dateChange(_)}
			                            {...getFieldProps(s.name,{
				                            initialValue:''
			                            })}
                                    >
                                        <DatePickerChildren
                                            style={{
	                                            paddingLeft: '.5rem'
                                            }}
                                        />
                                    </DatePicker>
                                </div>
                            )
                        }

                        <div className="group-button">
                            <div className="button" onClick={this.submit}>
                                Submit
                            </div>
                        </div>
                    </from>
                </div>

	            <Modal
		            visible={ flagModal }
		            transparent
		            onClose={ this.modalTypeCancel }
		            className="modalSelect"
	            >
		            <List>
			            {
				            this.taskData.map((s,v) =>
					            s?
						            <Radio.RadioItem
							            key={ s.value }
							            checked={ flagValue.value === s.value }
							            onChange={ e => this.onChange(e,s)}
						            >
							            { s.label }
						            </Radio.RadioItem>:null
				            )
			            }
		            </List>

	            </Modal>

            </Content>
        )
    }
};


FlightSearch = createForm()(FlightSearch);
FlightSearch = connect(state => ({
	flightState:state.ArrivalsState
}))(FlightSearch);
export default FlightSearch;