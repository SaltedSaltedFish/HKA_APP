
import React,{Component} from 'react';
import { Modal,ActivityIndicator,DatePicker,ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';
//import Chart from '../../../utils/Chart.js-master'

import Header from '../../../components/Header';
import Content from '../../../components/Content';



class Trendmap extends Component {
	constructor(props){
		super(props);
		this.state = {
		};

	}

	componentWillMount(){

	};

	componentDidMount(){
		let data = {
			labels : ["January","February","March","April","May","June","July"],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : [65,59,90,81,56,55,40]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [28,48,40,19,96,27,100]
				}
			]
		}

		// let ctx = document.getElementById("myChart").getContext("2d");
	     //  let myNewChart  = Chart.Line(ctx, {
		// 	  data: data,
		//   });


	}

	componentWillUnmount(){
	};


	render(){
		const { getFieldProps } = this.props.form;
		return (
			<Content
				style={{paddingBottom:0}}
			>
				<Header
					title="TREND MAP"
				>
				</Header>
				<div >
					{/*<canvas id="myChart" width="400" height="400"></canvas>*/}
				</div>
			</Content>
		)
	}
}


Trendmap = createForm()(Trendmap);
export default Trendmap;