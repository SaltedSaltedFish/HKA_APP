import './index.css';
import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Content from '../../../components/Content';
import Header from '../../../components/Header';
import ListViewTest from '../../../components/ListViewTest';
import WorkListADMIN from '../../../components/WorkListADMIN';
import Assigned from './Assigned';


class WorkOrderManage extends Component {
    constructor(props){
        super(props);
        //console.log(props);
        let array = props.location.search.replace(/\?/,'').split('&');
        let arrays = ['acreg','flightnum','assigndate'];
        let userFlag = localStorage.identity;
        let condition = {};

        array.map((s,v)=>
            condition[arrays[v]] = s
        );

        this.state = {
        	title:condition.flightnum,
	        condition,
        };
        this.url = 'workorder/getWorkOrderList';
    }

    componentWillMount(){

    };

    componentDidMount(){

    };

    componentWillUnmount(){
        this.setState = () => {};
    };

	rows(s,v){
		return (
            <Link
                to={{
					pathname: '/work_details',
					search: '?flight&id='+ s.assignworkid,
					state:{
						id:s.assignworkid
					}
				}}
                key={v}
            >
                <WorkListADMIN data={s}/>
            </Link>
		)
	};

    render(){
	    const { condition,title } = this.state;
        return (
                <Content
                    className="flightOrder"
                    style={{
                        paddingBottom:0
                    }}
                >
                    <Header title={title} />

                    <div
                        className="tabs"
                        style={{padding:'.3rem 0.3rem 0'}}
                    >
	                    <ListViewTest
		                    rows={ this.rows }
		                    url={ this.url }
		                    condition={ condition }
		                    method={`get`}
	                    />
                    </div>
                </Content>
        )
    }
}

WorkOrderManage = connect(state => ({
	AdminWorksheetList:state.AdminWorksheetList
}))(WorkOrderManage);

export default WorkOrderManage;