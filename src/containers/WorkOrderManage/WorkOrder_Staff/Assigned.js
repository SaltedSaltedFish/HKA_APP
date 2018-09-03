import './Assigned.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { RefreshControl, ListView ,Flex,ActivityIndicator} from 'antd-mobile';

import Api from '../../../api/request';
import getState from '../../../utils/getState';

import {connect} from 'react-redux';
import { empState } from '../../../actions/workOrder';

import ListViewComponent from '../../../components/ListView';
import { ListViewComponentEx1 } from '../../../components/ListViewTest';
/**/
import WorkListSTAFF from '../../../components/WorkListSTAFF';
import WorkListADMIN from '../../../components/WorkListADMIN';
import LMFlightList from '../../../components/LM/FlightList';
/**/

import { list } from '../../../data/lmFlight';

class Assigned extends Component {
    constructor(props){
        super(props);
        //console.log(props);
        let assigndate = props.condition.assigndate;
        let DATA  = props.reduxState.state;
        /*
        * @param userFlag string 0代表普通用戶 1代表管理員
        * */

	    let condition = {
		    assigndate,
	    	userFlag:'0',
		    //taskState:'0'
	    };
        this.state = {
	        assigndate,
	        DATA,

            condition,

            isUpdate:false,

	        width:'100%',
        };

	    //this.url = 'acflight/flight/list';
	    this.url = 'workorder/getWorkOrderList';
    }

    componentWillMount(){

    };

    componentWillUnmount(){
	    this.setState = _ => {};
    };

	componentDidMount(){

	};

	shouldComponentUpdate(nextProps){
		if ( nextProps.req ) {
			return true
		} else {
			return false
		};
	};

    componentWillReceiveProps(props){

	    //console.log(props);

	    if ( props.req ) {
		    let { condition } = this.state;
		    condition.assigndate = props.assigndate;

		    condition = {
			    ...condition,
			    ...props.condition
		    };

		    this.setState({
			    condition
		    });
	    };
    };

	actions = (obj) => {
		this.props.dispatch(empState({
			...obj
		}));
	};

    rows = (s) => {
        return (
            <Link
                to={{
                    pathname: '/work_details',
                    search: '?id='+ s.assignworkid,
                    state:{
                        id:s.assignworkid
                    }
                }}
            >
				<WorkListADMIN data={s}/>
            </Link>
        )
    };

	// rows = (s,v) => {
	// 	return (
	// 		<Link
	// 			to={{
	// 				pathname: '/flight_details',
	// 				search: s.aclogid +'&'+this.state.flightdate,
	// 			}}
	// 		>
	// 			<LMFlightList data={s} />
	// 		</Link>
	// 	)
	// };

    render(){
        const { condition,DATA } = this.state;

	    let isLM = Boolean(localStorage.isLM);
        return (
            <div style={{height:'100%'}}>

	            {/*<ul className={`lm-flight title`}>*/}
		            {/*{*/}
			            {/*list.map( (s,v) =>*/}
				            {/*<li ref={s.type} key={v}>{s.name}</li>*/}
			            {/*)*/}
		            {/*}*/}
	            {/*</ul>*/}

	            <ListViewComponentEx1
		            data={DATA}
		            rows={ this.rows }
		            url={ this.url }
		            update={ true }
		            condition={condition}
		            method={'get'}
		            action={ this.actions }
	            />

	            {/*<ListViewComponent*/}
		            {/*dataSource={dataSource}*/}
		            {/*hasMore={hasMore}*/}
		            {/*rollingState={rollingState}*/}
		            {/*style={{*/}
		            	{/*height:'72vh'*/}
		            {/*}}*/}
		            {/*rows={(s,v)=> this.rows(s,v)}*/}
		            {/*refreshing={refreshing}*/}
		            {/*onScroll={this.onScroll}*/}
		            {/*onRefresh={this.onRefresh}*/}
		            {/*onEndReached = {this.onEndReached}*/}
	            {/*/>*/}
            </div>
        )
    }
}


Assigned = connect(state => ({
	reduxState:state.EmployeeWorksheetList
}))(Assigned);

export default Assigned;