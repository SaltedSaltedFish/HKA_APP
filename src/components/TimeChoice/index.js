import './index.less';
import React,{ Component } from 'react';
import { DatePicker } from 'antd-mobile';
import moment from 'moment';

import TimeConversion from '../../utils/TimeConversion';


const DatePickerChildren = props =>
	<div
		onClick={props.onClick}
		className="datePicker-date"
	>
		{props.extra}
	</div>;

const dayMs = 24*60*60*1000;

//  加减时间
export class TimeChoice extends Component {
	constructor(props){
		super(props);
		//  一天的毫秒
		let nowDate = TimeConversion.date();
		let dpValue = moment(props.nowDate?props.nowDate:nowDate).locale('zh-cn').utcOffset(8);
		this.state = {
			dpValue
		};
	};

	componentWillUnmount () {
		this.setState = _ => {};
	};

	//  时间变化
	dateChange = _ => {
		const date = _._d;
		let nowDate = TimeConversion.TIME(date);
		let condition = {};
		condition.flightdate = nowDate;
		this.props.fn({dpValue:_,nowDate,condition});
		this.setState({ dpValue: _ ,nowDate:nowDate,condition});
	};

	//  增加
	increase = _ => {
		let dateDefault = this.state.dpValue;
		let date = dateDefault._d;
		let nowDate;
		date = date.getTime() + dayMs;
		//console.log(new Date(date));
		dateDefault._d = new Date(date);
		nowDate = TimeConversion.TIME(new Date(date));
		dateDefault._i = nowDate;
		let condition = {};
		condition.flightdate = nowDate;
		this.props.fn({dpValue:dateDefault,nowDate,condition});
		this.setState({ dpValue: dateDefault ,nowDate,condition});
	};
	//  减少
	reduce = _ => {
		let dateDefault = this.state.dpValue;
		let date = dateDefault._d;
		let nowDate;
		date = date.getTime() - dayMs;
		dateDefault._d = new Date(date);
		nowDate = TimeConversion.TIME(new Date(date));
		dateDefault._i = nowDate;
		let condition = {};
		condition.flightdate = nowDate;
		this.props.fn({dpValue:dateDefault,nowDate,condition});
		this.setState({ dpValue: dateDefault ,nowDate:nowDate,condition});
	};

	render(){
		const { dpValue } = this.state;
		let { style } = this.props;
		if (!style) {
			style = {}
		}
		return (
			<div
				className="datePicker"
				style={{...style}}
			>
				<div className="date-change date-increase" onClick={this.increase}></div>
				<div className="date-change date-reduce" onClick={this.reduce}></div>
				<DatePicker
					mode="date"
					extra="选择"
					value={dpValue}
					onChange={v => this.dateChange(v)}
				>
					<DatePickerChildren></DatePickerChildren>
				</DatePicker>
			</div>
		)
	};
};

//  选择时间
export class TimeCHOICE extends Component {
	constructor(props){
		super(props);
		//  一天的毫秒
		let nowDate = TimeConversion.date();
		let dpValue = moment(props.nowDate || nowDate).locale('zh-cn').utcOffset(8);
		let extra = props.extra || '';
		this.state = {
			dpValue
		};
	};

	componentWillUnmount () {
		this.setState = _ => {};
	};

	//  时间变化
	dateChange = _ => {
		const date = _._d;
		let nowDate = TimeConversion.TIME(date);
		let condition = {};
		condition.flightdate = nowDate;
		this.props.fn({dpValue:_,nowDate,condition});
		this.setState({ dpValue: _ ,nowDate:nowDate,condition});
	};

	render(){
		const { dpValue,extra } = this.state;
		return (
			<div className="datePicker">
				<DatePicker
					mode={this.props.type?this.props.type:'date'}
					extra={extra}
					value={dpValue}
					onChange={v => this.dateChange(v)}
				>
					<DatePickerChildren></DatePickerChildren>
				</DatePicker>
			</div>
		)
	};
};

//  选择年
export class TimeYear extends Component {
	constructor(props){
		super(props);
		let nowDate = TimeConversion.date();
		let dpValue = moment(props.nowDate?props.nowDate:nowDate).locale('zh-cn').utcOffset(8);
		this.state = {
			dpValue
		};
	};

	componentWillUnmount () {
		this.setState = _ => {};
	};

	//  时间变化
	dateChange = _ => {
		const date = _._d;
		let nowDate = TimeConversion.year(TimeConversion.TIME(date));
		let condition = {};
		condition.flightdate = nowDate;
		this.props.fn({nowDate});
		this.setState({ dpValue: _ ,nowDate:nowDate,condition});
	};

	render(){
		const { dpValue } = this.state;
		return (
			<div className="datePicker">
				<DatePicker
					mode={`year`}
					extra="选择"
					value={dpValue}
					format={(value) => this.props.month.FigureThree + ' ' + TimeConversion.year(value._d)}
					onChange={v => this.dateChange(v)}
				>
					<DatePickerChildren></DatePickerChildren>
				</DatePicker>
			</div>
		)
	};
};

TimeChoice.propTypes = {

};
TimeCHOICE.propTypes = {

};

