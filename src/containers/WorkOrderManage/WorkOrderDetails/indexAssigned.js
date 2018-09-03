import './index.css';

import React,{ Component } from 'react';
import { Flex ,Modal,List, InputItem,ActivityIndicator} from 'antd-mobile';
import { Link } from 'react-router-dom';

import FlightInfo from '../../../components/FlightInfo';
import Api from '../../../api/request';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Footer from '../../../components/Footer';
import WorkListADMIN from '../../../components/WorkListADMIN';


const FlexItem = Flex.Item;
const alert = Modal.alert;

class IndexAssigned extends Component {
    constructor(){
        super();
        this.state = {
            data:{},
            hours:false,
            moneyfocused:false,
            isRequest:true,

			Reference:false
		};

		this.getReference = '/nrc/getReference';
    };

    componentWillMount(){
        const id = this.props.location.search.replace('?id=','');
        Api.get('workorder/getWorkOrderById',{assignworkid:id})
			.then(res => {
				let data = false;
				if (res.errorCode == 0) {
					data = res.data
				};

				this.setState({
					data,
					isRequest:false
				});

				return data;

			})
			.then(json => {
				console.log(json);
				json?
					Api.post(this.getReference,{tasknum:json.tasknum})
						.then(res=> {
							let Reference = res.reference || res.data.reference || false;
							if (Reference) {
								this.setState({
									Reference
								})
							};
						}):null;
			})
    };

    componentWillUnmount(){
        this.setState = _ => {};
    };

    render(){
        const {data,isRequest,Reference} = this.state;
        const id = this.props.location.search.replace('?id=','');
        let stateCode = true;
        return (
            <Content
                style={stateCode?{
                    paddingBottom:0
                }:null}
            >

				<Header
					title={data?data.wono:''}
				>
				</Header>

	            {
		            Reference?
			            <div className="transmit icon icon-task">
				            <Link
					            to={{
						            pathname: '/add_task',
						            search: `?reference=${Reference.REFERENCES}`,
						            state:data
					            }}
				            />
			            </div>
			            :null
	            }

                {
                    isRequest?<ActivityIndicator/>:
                        !data?<div className="noData hasPadding">No Data</div>:
                        <div>
                            <div data-name="workDetailsAdmin">
                                <div className="details-top">
                                    <div className="details-work">
										<WorkListADMIN data={ data }/>
                                    </div>
                                    <div className="details-relation">
                                        Associated FLT
                                    </div>
                                    <FlightInfo data={data} />
                                </div>
                                <div className="details-bottom">

                                    <div className="details-list">
                                        <div className="list-title">
                                            MH
                                        </div>
                                        <div className="list-info">
                                            <div>{data.mh}</div>
                                        </div>
                                    </div>
                                    <div className="details-list" style={{borderBottom:0}}>
                                        <div className="list-title">
                                            Zone
                                        </div>
                                        <div className="list-info">
                                            <div>{data.zone}</div>
                                        </div>
                                    </div>

                                    <div className="details-description">
                                        <p className="list-color2">Job Card Description</p>
                                        <p>{data.jobcardDescription}</p>
                                    </div>

                                    <div className="details-list" style={{borderTop:0}}>
                                        <div className="list-title">
                                            Performer
                                        </div>
                                        <div className="list-info">
                                            <div>{data.performer}</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    !stateCode?
                                    <div className="details-action">
                                        <Flex
                                            justify="between"
                                        >
                                            <FlexItem>
                                                <Link
                                                    to={{
                                                        pathname: '/deferral',
                                                        state:data,
                                                        search: id,
                                                    }}
                                                >
                                                    <div className="action">DEFERRING</div>
                                                </Link>

                                            </FlexItem>
                                            <FlexItem>
                                                <Link
                                                    to={{
                                                        pathname: '/handover_selection',
                                                        state:data,
                                                        search: id,
                                                    }}
                                                >
                                                    <div className="action">HANDOVER</div>
                                                </Link>
                                            </FlexItem>
                                            {/*<FlexItem>*/}
                                                {/*<Link*/}
                                                    {/*to={{*/}
                                                        {/*pathname: '/work_change'*/}
                                                    {/*}}*/}
                                                {/*>*/}
                                                    {/*<div className="action">CHANGE</div>*/}
                                                {/*</Link>*/}
                                            {/*</FlexItem>*/}
                                        </Flex>
                                    </div>:null
                                }
                            </div>
                            {
                                !stateCode?
                                    <Footer>
                                        <div>
                                            <Link
                                                to={{
                                                    pathname: '/job_feedback',
                                                    state: data,
                                                    search: id,
                                                }}
                                            >
                                                <div
                                                    className="feedback"
                                                >
                                                    FEEDBACK
                                                </div>
                                            </Link>
                                        </div>
                                    </Footer>
                                    :null
                            }
                        </div>
                }
            </Content>
        )
    }
}
export default IndexAssigned;