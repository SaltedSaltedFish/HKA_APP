import './index.css';
import './index.less';

import React,{Component} from 'react';
import { Flex,ActivityIndicator,Button,Modal} from 'antd-mobile';
import { Link } from 'react-router-dom';

import Api from '../../../api/request';
import getState from '../../../utils/getState';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Footer from '../../../components/Footer';
import FlightInfo from '../../../components/FlightInfo';

//import WorkDetailsStaff from './staff';

import WorkListSTAFF from '../../../components/WorkListSTAFF';

const FlexItem = Flex.Item;

class WorkDetails extends Component {
    constructor(props){
        super(props);
        /*
        * oneself 是否是本人
        * identity 是否是管理员
        * stateCode 工单状态
        * */
	    let assignworkid = '';
	    let identity = Boolean(Number(localStorage.identity));
	    let isFlight = false;

	    //console.log(props.location.search.indexOf('flight'));

        if ( props.location.search.indexOf('flight') != -1) {
	        assignworkid = props.location.search.replace('?flight&id=','');
	        isFlight = true;
        } else {
	        assignworkid = props.location.search.replace('?id=','');
        };

        //console.log(assignworkid);
        this.state = {
	        assignworkid,
            data:false,
            hours:false,
            moneyfocused:false,
            isRequest:true,

			Reference:false,
	        meterials:[],
	        tool:[],
	        oneself:false,  //  只能是被指派的人做操作
	        stateCode:false,
	        identity,

	        isFlight,    //  用来判断是否是航班进入的,

	        isLoading:false,    //  汇报工作进度条

		};

		this.getReference = '/nrc/getReference';

		this.timer = {};
    };

    componentWillMount(){

    };

    componentDidMount(){
	   const { assignworkid } = this.state;
	    Api.post('workorder/getEnginnerWorkInfo',{ assignworkid })
		    .then(res => {

			    let data = false;
			    let workOrder,stateCode,tool,meterials,oneself;

			    if ( res.errorCode == 0 ) {
				    data = res.data;
				    workOrder = data.workOrder;
				    stateCode = workOrder ?
					    (
					    	!Boolean(workOrder.accomplishedStatus)
						    // ||
						    // !(workOrder.taskcompletion == 'Y')
						    // ||
						    // !(workOrder.taskcompletion == 'N')
					    )
					    :false;
				    //console.log(!Boolean(workOrder.accomplishedStatus),!(workOrder.taskcompletion == 'Y'),!(workOrder.taskcompletion == 'N'))
				    meterials = data.meterials;
				    tool = data.tool;
				    oneself = workOrder?( workOrder.engineeruser == localStorage.userAccount ):false;
				    //console.log(Boolean(workOrder.accomplishedStatus),
				    //(!Boolean(workOrder.accomplishedStatus) || !(workOrder.taskcompletion == 'Y')));
			    };

			    this.setState({
				    data,
				    workOrder,
				    stateCode,
				    tool,
				    meterials,
				    oneself,
				    isRequest:false
			    });

			    return workOrder

		    })
		    .then(json => {
			    //console.log(json);
			    json?
				    Api.post(this.getReference,{tasknum:json.taskno})
					    .then(res=> {

						    let Reference = false;

						    if(res.errorCode == 0) {
							    Reference = res.data.reference?res.data.reference:false;
						    };

						    if ( Reference ) {
							    this.setState({
								    Reference
							    });
						    };

					    }):null;
		    })
    };

    judge = (obj,oneself) => {

	    //workOrder.workstuts != '03' && oneself?

    	let text = '准备工作完成',status = '00',disabled = (obj == '03' || !oneself);

    	//console.log(disabled);

    	if (obj == '00') {
		    text = '到达工作地点';
		    status = '01';
	    } else if (obj == '01') {
		    text = '开始工作';
		    status = '02';
	    } else if (obj == '02') {
		    text = '工作完成';
		    status = '03';
	    } else if (obj == '03') {
		    text = '汇报已完成';
	    };

	    return (
		    <Button
			    type="primary"
			    inline
			    size={'small'}
			    disabled={disabled}
			    onClick={()=>this.reportWorkstuts(status)}
		    >
			    { text }
		    </Button>
	    )
    };

    /*汇报工作状态*/
	reportWorkstuts = (appstuts) => {

		let { assignworkid,workOrder } = this.state;

		//console.log(appstuts);

		this.setState({
			isLoading:true
		});

		Api.post('assignworkstuts/saveassignworkstuts',{assignworkid,appstuts})
			.then(res => {
				if ( res.errorCode == 0) {
					workOrder.workstuts = appstuts;
					Modal.alert('success');
				} else {
					Modal.alert(res.errorMsg);
				};

				this.setState({
					workOrder,
					isLoading:false
				})
			})
	};

    componentWillUnmount(){
	    clearInterval(this.timer);
        this.setState = _ => {};
    };

    render(){
        let {
        	data,isRequest,Reference,identity,assignworkid,
	        stateCode,tool,meterials,workOrder,oneself,isFlight,isLoading
        } = this.state;

        //console.log(oneself,stateCode);

	    //isFlight = true;

        return (
            <Content
	            style={{paddingBottom:0}}
            >
	            <Header
	                title={data.workOrder?data.workOrder.wono:''}
	            >
	            </Header>

	            <ActivityIndicator
		            toast
		            text="Loading..."
		            animating={ isLoading }
	            />

	            {
		            Reference?
			            <div className="transmit icon icon-task">
				            <Link
					            to={{
						            pathname: '/add_task',
						            search: `?reference=${Reference.REFERENCES}`,
						            state:data.workOrder
					            }}
				            />
			            </div>
			            :null
	            }

                {
                    isRequest?<ActivityIndicator/>:
	                    !workOrder?<div className="noData hasPadding">No Data</div>:
                        <div>
                            <div data-name="workDetailsStaff">
                                <div className="details-top">
                                    <div className="details-work">
	                                    <WorkListSTAFF data={workOrder}/>
                                    </div>
	                                {
		                                isFlight?
			                                <div>
				                                <div className="details-relation">
					                                Associated FLT
				                                </div>
				                                <FlightInfo data={workOrder} />
			                                </div>:
			                                <div>
				                                <Link
					                                to={{
						                                pathname:'/flight_details',
						                                search:
						                                '?work' +
						                                '&' + workOrder.flightnumx +
						                                '&' + workOrder.plandate +
						                                '&' + workOrder.acreg
					                                }}
				                                >
					                                <div className="details-relation">
						                                <div className="icon icon-list-"></div>
						                                Associated FLT
					                                </div>
					                                <p
					                                    style={{
					                                    	color:'white',
						                                    textAlign:'center',
						                                    padding:'.2rem .2rem 0'
					                                    }}
					                                >{ workOrder.flightnumx }</p>
					                                <FlightInfo data={workOrder} />
				                                </Link>
			                                </div>
	                                }
                                </div>
	                            {/*<div className="personnel-state">*/}
		                            {/*{*/}
			                            {/*this.judge(workOrder.workstuts,oneself)*/}
		                            {/*}*/}
	                            {/*</div>*/}

                                {
                                    tool.length > 0?
                                        <div className="details-workInfo">
                                            <h2>TOOLS</h2>
                                            <div className="workInfo-container">
                                                {
                                                    tool.map((s,v)=>
                                                        <div key={v} className="workInfo-list">
                                                            <div className="list-title">
                                                                <div>
                                                                    <span>ToolPN：</span>
                                                                    <span className="title-info">{s.pn}</span>
                                                                </div>
                                                                <div>
                                                                    <span>QTY：</span>
                                                                    <span className="title-info">{s.qty}</span>
                                                                </div>
                                                            </div>
                                                            <div className="list-info">
                                                                {s.descriptions}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>:null
                                }

                                {
                                    meterials.length > 0?
                                        <div className="details-workInfo">
                                            <h2>METERIALS</h2>
                                            <div className="workInfo-container">
                                                {
                                                    meterials.map((s,v)=>
                                                        <div key={v} className="workInfo-list">
                                                            <div className="list-title">
                                                                <div>
                                                                    <span>ToolPN：</span>
                                                                    <span className="title-info">{s.pn}</span>
                                                                </div>
                                                                <div>
                                                                    <span>QTY：</span>
                                                                    <span className="title-info">{s.qty}</span>
                                                                </div>
                                                            </div>
                                                            <div className="list-info">
                                                                {s.descriptions}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>:null
                                }

                                <div className="details-bottom">

                                    <div className="details-list">
                                        <div className="list-title">
                                            Zone
                                        </div>
                                        <div className="list-info">
                                            <div>{workOrder.zone}</div>
                                        </div>
                                    </div>

                                    <div className="details-list">
                                        <div className="list-title">
                                            FlightNum
                                        </div>
                                        <div className="list-info">
                                            <div>{workOrder.flightnum}</div>
                                        </div>
                                    </div>

                                    <div className="details-list">
                                        <div className="list-title">
                                            engineeruser
                                        </div>
                                        <div className="list-info">
                                            <div>{workOrder.engineeruser}</div>
                                        </div>
                                    </div>

                                    <div className="details-list">
                                        <div className="list-title">
                                            MH
                                        </div>
                                        <div className="list-info">
                                            <div>{workOrder.manhours}</div>
                                        </div>
                                    </div>
                                </div>

                                {
									//oneself && !identity?
	                                oneself?
                                    stateCode?
                                        <div className="details-action">
                                            <Flex
                                                justify="between"
                                                // style={{paddingLeft: '2.3rem'}}
                                            >
                                                {/*<FlexItem>*/}
                                                    {/*<Link*/}
                                                        {/*to={{*/}
                                                            {/*pathname: '/deferral',*/}
                                                            {/*search:'?'+ assignworkid,*/}
                                                            {/*state:workOrder*/}
                                                        {/*}}*/}
                                                    {/*>*/}
                                                        {/*<div className="action">DEEFRRING</div>*/}
                                                    {/*</Link>*/}

                                                {/*</FlexItem>*/}

                                                <FlexItem>
                                                    <Link
                                                        to={{
                                                            pathname: '/handover_selection',
                                                            state:data,
                                                            search:'?'+ assignworkid + '&' + workOrder.taskno + '&' + workOrder.acreg + '&' + workOrder.flightnumx,
                                                        }}
                                                    >
                                                        <div className="action">Hand Over</div>
                                                    </Link>
                                                </FlexItem>

	                                            <FlexItem>
		                                            <Link
			                                            to={{
				                                            pathname: '/job_feedback',
				                                            //state: data,
				                                            search: '?' + JSON.stringify(data),
			                                            }}
		                                            >
			                                            <div
				                                            className="action"
			                                            >
				                                            Feedback
			                                            </div>
		                                            </Link>
	                                            </FlexItem>

                                            </Flex>
                                        </div>:null:null
                                }
                            </div>

	                        {/*{*/}
		                        {/*oneself?*/}
		                        {/*stateCode?*/}
			                        {/*<Footer>*/}
				                        {/*<div>*/}
					                        {/*<Link*/}
						                        {/*to={{*/}
							                        {/*pathname: '/job_feedback',*/}
							                        {/*//state: data,*/}
							                        {/*search: '?' + JSON.stringify(data),*/}
						                        {/*}}*/}
					                        {/*>*/}
						                        {/*<div*/}
							                        {/*className="feedback"*/}
						                        {/*>*/}
							                        {/*FEEDBACK*/}
						                        {/*</div>*/}
					                        {/*</Link>*/}
				                        {/*</div>*/}
			                        {/*</Footer>*/}
			                        {/*:null:null*/}
	                        {/*}*/}
                        </div>
                }
            </Content>
        )
    }
}
export default WorkDetails;