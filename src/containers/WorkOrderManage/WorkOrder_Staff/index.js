import './index.css';
import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import {createForm} from 'rc-form';
import {connect} from 'react-redux';

import Content from '../../../components/Content';
import { TimeChoice } from '../../../components/TimeChoice';
import TimeConversion from '../../../utils/TimeConversion';
import Transition from '../../../components/Transition';
import Assigned from './Assigned';
import WorkCondition from '../WorkCondition';

class WorkOrderManage extends Component {
    constructor(props){
        super(props);
        let nowDate = sessionStorage.StaffWordNowDate?sessionStorage.StaffWordNowDate:
			TimeConversion.date();
        this.state = {
            filterType:'',
            nowDate,
            condition:{
	            assigndate:nowDate
            },
			inProp:false,
	        req:true,
        };
    }

    componentWillMount(){

    };

    componentDidMount(){

        this.filterShow = _ => {
            let dom = this.refs.filter;
            if(dom.style.display == 'block'){
                dom.style.display = 'none';
            } else {
                dom.style.display = 'block';
            }
        };

        this.filterFn = _ => {
            if(_.target.className.indexOf('filterActive') != -1){
                //console.log(_.target.className.replace('filterActive',''));
                _.target.className = _.target.className.replace(' filterActive','');
                this.setState({
                    filterType:''
                });
                return;
            }
            let dom = Array.from(document.getElementsByClassName('filterActive'));
            dom.forEach(d => d.className = d.className.replace(' filterActive',''));

            this.setState({
                filterType:_.target.className
            });

            _.target.className += ' filterActive';
        };

    }

    componentWillUnmount(){
		sessionStorage.StaffWordNowDate = this.state.condition.assigndate;
		this.setState = _ => {};
    };

    //
    updateTime = (obj) =>{
    	let { condition } = this.state;
	    condition.assigndate = obj.nowDate;
    	this.setState({ condition,req:true });
    };

	toggle = _ => {


		this.setState({
			inProp:!this.state.inProp,
			req:false,
		});
	};

	update = (obj) => {
		let { condition } = this.state;

		condition = {
			...condition,
			...obj,
		};

		this.setState({condition,req:true});
	};

    render(){
        const { condition,nowDate,inProp,req } = this.state;
		const { getFieldProps } = this.props.form;
        return (
                <Content>
                    <div id="common-header">
                        <Link
                            to={{
                                pathname:'/scanning'
                            }}
                        >
                            <div className="icon icon-scanning">

                            </div>
                        </Link>

						{/*<div className="icon icon-condition" onClick={this.toggle}>*/}

						{/*</div>*/}

                        {/*<div className="icon icon-filter" onClick={_ => this.filterShow(_)}>*/}

                        {/*</div>*/}

                        <p className="title">Work Order</p>

                        <div className="icon icon-condition" style={{right:0}} onClick={this.toggle}>

                        </div>

                    </div>

                    <TimeChoice nowDate={condition.assigndate} fn={this.updateTime}/>

                    <div
                        className="tabs"
                        style={{padding:'1rem .3rem 0',height:'100%'}}
                    >
                        <Assigned req={req} condition={{...condition}} />
                    </div>

                    <div className="filterContainer" ref="filter" style={{
                        zIndex:'99999'
                    }}>
                        <ul>
                            <li
                                className="ONGOING"
                                onClick={_=>this.filterFn(_)}
                            >
                                <p>ONGOING</p>
                                <span className="icon icon-click "></span>
                            </li>
                            <li
                                className="DELAYED"
                                onClick={_=>this.filterFn(_)}
                            >
                                <p>DELAYED</p>
                                <span className="icon icon-click "></span>
                            </li>
                            <li
                                className="HANDOVER"
                                onClick={_=>this.filterFn(_)}
                            >
                                <p>HANDOVER</p>
                                <span className="icon icon-click "></span>
                            </li>
                            <li
                                className="OVERDUE"
                                onClick={_=>this.filterFn(_)}
                            >
                                <p>OVERDUE</p>
                                <span className="icon icon-click "></span>
                            </li>
                        </ul>
                    </div>

                    {
						inProp?
                            <Transition>
                                <div className="mark" onClick={this.toggle}></div>
                                <WorkCondition type={1} condition={condition} fn={this.update} toggle={this.toggle}/>
                            </Transition>:null
                    }
                </Content>
        )
    }
}
WorkOrderManage = connect(state => ({
	reduxState:state.EmployeeWorksheetList
}))(WorkOrderManage);
WorkOrderManage = createForm()(WorkOrderManage);
export default WorkOrderManage;