
import React,{ Component } from 'react';

import { createForm } from 'rc-form';
import { DatePicker,ActivityIndicator } from 'antd-mobile';

import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import DatePickerChildren from '../../../components/DatePickerChildren';
import { TimeCHOICE } from '../../../components/TimeChoice';

import moment from 'moment';
import Native from "../../../utils/Native";

class OIIput extends Component {

    constructor(props){
        super(props);
        let data = props.location.state?props.location.state:{};
	    let nowDate = data.flightdate;
        const zhNow = moment(nowDate).locale('zh-cn').utcOffset(8);

        this.state = {
            dpValue:zhNow,
			data,
	        nowDate,

	        loading:false
        };

        this.url = 'oi/report';
        this.flightdate = nowDate;
    };

    componentWillUnmount(){
        this.setState = () => {};
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            if(!error) {
            	this.setState({
		            loading:true
	            });
            	value.flightdate = this.flightdate;
				Api.post(this.url,value)
					.then(res => {
						this.setState({
							loading:false
						});
						if ( res.errorCode == 0){
							if (res.data.status == 1) {
								Native.alert('error');
								return;
							}
							Native.alert('success');
						} else {
							Native.alert('error');
						}
						console.log(res);
					})
            } else {
            	let array = [];

            	for (let i in error) {
            		array.push(i);
				};

            	console.log(array[0]+' is required');
            	Native.alert(array[0]+' is required');
			}
        });
    };

    //  时间变化
    dateChange = obj => {
        console.log(obj);
        this.flightdate = obj.nowDate;
    };

    render(){
        const { getFieldProps } = this.props.form;
        const { dpValue,data,loading,nowDate } = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="OI Input"/>
                <div className="from-input" style={{padding:'.3rem'}}>
                    <from className="submit">
                        <div className="group-input">
                            <span>FlightNo</span>
                            <input type="text" {...getFieldProps('flightno',{
                                initialValue:data.flightno,
								rules: [{ required: true}]
                            })}/>
                        </div>

                        <div className="group-input">
                            <span>Acreg</span>
                            <input type="text" {...getFieldProps('acreg',{
                                initialValue:data.acreg,
								rules: [{ required: true}]
                            })}/>
                        </div>

                        <div className="group-input">
                            <span>FlightDate</span>
	                        <TimeCHOICE fn={ this.dateChange } nowDate={nowDate}/>
                            {/*<DatePicker*/}
                                {/*mode="date"*/}
                                {/*extra=""*/}
                                {/*onChange={_ => this.dateChange(_)}*/}
                                {/*{...getFieldProps('flightdate',{*/}
                                    {/*initialValue:dpValue,*/}
                                    {/*rules: [{ required: true}]*/}
                                {/*})}*/}
                                {/*>*/}
                                {/*<DatePickerChildren*/}
	                                {/*style={{paddingLeft:'1.5rem'}}*/}
                                {/*/>*/}
                            {/*</DatePicker>*/}
                        </div>

						<div className="group-input">
							<span>DEPSTN</span>
							<input type="text" {...getFieldProps('depstn',{
								initialValue:data.depstn,
								rules: [{ required: true}]
							})}/>
						</div>

						<div className="group-input">
							<span>ARRSTN</span>
							<input type="text" {...getFieldProps('arrstn',{
								initialValue:data.arrstn,
								rules: [{ required: true}]
							})}/>
						</div>

                        <div className="group-button">
                            <div className="button" onClick={this.submit}>
                                Submit
                            </div>
                        </div>
                    </from>
                </div>

	            <ActivityIndicator
		            toast
		            text="Loading..."
		            animating={ loading }
	            />
            </Content>
        )
    }
};


OIIput = createForm()(OIIput);
export default OIIput;