import './index.css';

import React,{ Component } from 'react';
import { Flex,ActivityIndicator,Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import FlightInfo from '../../../components/FlightInfo';

import WorkListADMIN from '../../../components/WorkListADMIN';

import Api from '../../../api/request';
import Native from "../../../utils/Native";

const FlexItem = Flex.Item;

class ApplicationDetails extends Component {
    constructor(props){
        super(props);
        console.log(props);
        let button = props.location.state.status?props.location.state.status == '0'?true:false:true;
        let fromassignworkid = props.location.search.replace('?id=','');
        let dataList = props.location.state;
        this.state = {
			fromassignworkid,
			data:false,
	        isLoading:false,
			dataList,
			turnid:dataList.turnid,
			tasknum:dataList.taskno,

			button
		};
    };

    componentWillMount(){
		const { fromassignworkid } = this.state;
		Api.get('workorder/getWorkOrderById',{ assignworkid:fromassignworkid })
			.then(res=>{
				this.setState({
					data:res.data,
					isLoading:true
				});
			})
	};

	componentWillUnmount(){
		this.setState = _ => {};
	};

    submit = status => {
		const { fromassignworkid,tasknum,turnid } = this.state;
		this.props.form.validateFields((error,value)=>{
			if (!error) {
				value.tasknum = tasknum;
				value.turnid = turnid;
				value.fromassignworkid = fromassignworkid;
				value.status = status;

				//console.log(value);
				Api.post('workorder/appproveDelayWork',{ ...value })
					.then(res=>{
						if (res.data.status == 1) {
							Modal.alert('success');
							this.setState({
								button:false
							});
							return;
						}
						Modal.alert('Has been approved');
						console.log(res);
					});

				return;
			}
			Modal.alert('Description is required')
		});
    };

    render(){
        const { data,button,dataList,isLoading } = this.state;
		const { getFieldProps } = this.props.form;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="AUDITING" />
	            {
		            isLoading?
			            data?
				            <div>
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
						            <div className="from-input">
							            <from className="submit">

								            <div className="group-input">
									            <p>Description</p>
									            <textarea
										            cols="30"
										            rows="10"
										            {...getFieldProps('approvalreason',{
											            initialValue:button?'':dataList.approvalreason,
											            rules: [{ required: true}]
										            })}
										            disabled={button?false:true}
									            ></textarea>
								            </div>

							            </from>

							            {
								            button?
									            <Flex
										            className="applicationButton"
									            >
										            <FlexItem>
											            <div className="button button-reject" onClick={e => this.submit(2)}>
												            <span className="icon icon-reject"></span>
												            <p>REJECT</p>
											            </div>
										            </FlexItem>
										            <FlexItem>
											            <div className="button button-approval" onClick={e => this.submit(1)}>
												            <span className="icon icon-approval"></span>
												            <p>APPROVAL</p>
											            </div>
										            </FlexItem>
									            </Flex>:null
							            }
						            </div>
					            </div>
				            </div>:<div className="noData hasPadding">内容丢失或已经被处理</div>:
			            <ActivityIndicator />
	            }
            </Content>
        )
    }
}

ApplicationDetails = createForm()(ApplicationDetails);
export default ApplicationDetails;