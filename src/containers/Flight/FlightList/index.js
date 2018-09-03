import './index.css';

import React,{Component} from 'react';
import {Tabs,Flex,DatePicker} from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import Native from '../../../utils/Native';

import TimeConversion from '../../../utils/TimeConversion';
import { TimeChoice } from '../../../components/TimeChoice';

import Content from '../../../components/Content';
import {FlightTitle} from '../../../components/FlightRows';

import Arriveals from './Arriveals';
import Departures from './Departures';

const TabPane = Tabs.TabPane;
const FlexItem = Flex.Item;

class FlightList extends Component {
    constructor(props){
        super(props);
        //  redux存储的数据
		let nowDate = props.flightState.flightdate?props.flightState.flightdate:TimeConversion.date();

        //console.log(zhNow);
        let defaultKey = sessionStorage.FlightDefaultKey?sessionStorage.FlightDefaultKey:'1';

        this.state = {
            nowDate,
            change:false, // 表示是否有变更机位
            defaultKey,
	        height:0,
        };

    }

    componentWillMount(){

    };

	componentDidMount(){

	};

    componentWillUnmount(){
        //sessionStorage.FlightDefaultKey;
        this.setState = () => {};
    };

    callback = defaultKey => {
        sessionStorage.FlightDefaultKey = defaultKey;
    };

	updateTime = (...obj) =>{
		this.setState(...obj)
	};

	changeGate = change => {
	    this.setState({
			change
		})
    };

    render(){
        let { nowDate,change,defaultKey,num } = this.state;

	    //change = !change;

	    let style = {},style_d = {},style_c = { position:'absolute', top: '.88rem' };

	    if ( change ) {
		    style = {overflow:'auto',height:'inherit',paddingTop:'1.5rem'};
		    style_d = { position:'absolute', top: '1.4rem' };
	    } else {
		    style = {overflow:'auto',height:'inherit',paddingTop:'.88rem'};
		    style_d = { position:'absolute', top: '.88rem' };
	    };

        return (
            <Content
                className={`remind`}
                style={{overflow:'hidden'}}
            >
	            <div className={`container`} ref={`box`}>
		            <div id="common-header">
			            <p className="title">FLT INT</p>
			            {/*<Link*/}
				            {/*to={{*/}
					            {/*pathname: '/flight_search',*/}
					            {/*search:nowDate,*/}
					            {/*state:{*/}
						            {/*nowDate:nowDate*/}
					            {/*}*/}
				            {/*}}*/}
			            {/*>*/}
				            {/*<div className="icon icon-search">*/}

				            {/*</div>*/}
			            {/*</Link>*/}
		            </div>

		            {
			            change?
				            <Link
					            to={{
						            pathname:'/flight_gate',
						            search:nowDate
					            }}
				            >
					            <div className="mation-bottom mation-bottoms" style={style_c}>
						            <div className="mation-list">
							            <div className="icon icon-list-">
								            {/*<span className="mation-badge">{ num }</span>*/}
							            </div>
							            <p>Flight Change Alert!</p>
						            </div>
					            </div>
				            </Link> :null
		            }

		            <TimeChoice
			            style={style_d}
			            nowDate={nowDate}
			            fn={this.updateTime}
		            />

		            <div
			            className="tabs"
			            style={style}
			            ref={'tabs'}
		            >
			            <Departures
				            nowDate={ nowDate }
				            fn={ this.changeGate }
				            height = { this.state.height }
			            />
		            </div>
	            </div>
            </Content>
        )
    }
}

FlightList = createForm()(FlightList);
FlightList = connect(state => ({flightState:state.ArrivalsState}))(FlightList);
FlightList = withRouter(FlightList);
export default FlightList;