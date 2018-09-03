import './index.less';

import React,{Component} from 'react';
import { Flex } from 'antd-mobile';
import {withRouter} from "react-router";

const FlexItem = Flex.Item;

class FlightList extends Component {
	constructor(props){
		super(props);
	};

	link  = (e,obj) => {
		e.preventDefault();
		this.props.history.push('/flight_order?'+obj.acreg + '&' + obj.fltid + '&' + obj.flightdate);
	};
	
	render(){
		const { data } = this.props;
		return (
			<div className="flight-list">
				<div className="departuresone">
					<Flex
						justify="end"
						style={{paddingBottom:'0.3rem'}}
					>
						<FlexItem className="fltno">FLT#</FlexItem>
						<FlexItem className="fltid">{data.fltid}</FlexItem>
						{/*<FlexItem></FlexItem>*/}
						<FlexItem className="fltno" style={{marginLeft:'0.3rem'}}>ACREG</FlexItem>
						<FlexItem className="fltid">{data.acreg}</FlexItem>
					</Flex>
					<Flex
						justify="end"
						style={{paddingBottom:'0.3rem'}}
					>
						<FlexItem className="fltno">STA</FlexItem>
						<FlexItem className="fltid">{data.sta.split(' ')[1]}</FlexItem>
						<FlexItem className="fltno" style={{marginLeft:'0.6rem'}}>GATE</FlexItem>
						<FlexItem className="fltid">{data.gate}</FlexItem>
					</Flex>
					<Flex
						justify="end"
						onClick={(e) => this.link(e,data)}
					>
						<FlexItem className="fltno">TASK</FlexItem>
						<FlexItem className="fltid">{data.workNum}</FlexItem>
						<FlexItem className="fltno" style={{marginLeft:'0.6rem'}}>STATUE</FlexItem>
						<FlexItem className="fltid" style={{color:'#ffa800'}}>{data.status}</FlexItem>
					</Flex>
				</div>
				<div className="departurestwo">
					<div style={{height:'0.3rem'}}>
						<div className="hka">{data.depstn}</div>
						<div className="hkatosk"></div>
						<div className="sk">{data.arrstn}</div>
					</div>
					<div style={{marginTop:'0.26rem',textAlign:'left',lineHeight:'1.5'}}>
						<span style={{color:'#929292'}}>ETD </span>
						<span> {data.etdFomat} / </span>
						<span style={{color:'#929292'}}>ETA </span>
						<span> {data.etaFomat}</span>
						<br/>
						<span style={{color:'#929292'}}>ATD </span>
						<span> {data.atdFomat} / </span>
						<span style={{color:'#929292'}}>ATA </span>
						<span> {data.ataFomat}</span>
					</div>
				</div>
			</div>
		)
	}
};

export default withRouter(FlightList);