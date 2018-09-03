import './menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';
import TimeConversion from '../../utils/TimeConversion';
import Api from '../../api/request';

class ManualMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:[],
            isRequest:true
        };
    };

    componentWillMount(){
        const addid = this.props.location.search.replace('?','');
        Api.get('add/getAddInfo',{addid})
            .then(res => this.setState({
                data:res.data,
                isRequest:false
            }))
    };

    render(){
        const {data,isRequest} = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="ADD"/>
                {
                    isRequest?<ActivityIndicator />:
                        <div className="manual-three">
                            <div className="manual-title">
                                ADD NO.：{data.addno}
                                <span className={data.state}>{data.state}</span>
                            </div>
                            <div className="manual-describe">
                                <p style={{color: '#b5b4bc'}}>Defect Desc</p>
                                <p>{data.defectDesc}</p>
                            </div>

							<div className="manual-describe">
								<p style={{color: '#b5b4bc'}}>LIMITATION</p>
								<p>{data.punishment}</p>
							</div>

                            <div className="manual-list">
                                <div className="details-list">
                                    <div className="list-title">ACREG</div>
                                    <div className="list-info">
                                        <div>{data.acreg}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">DUEDATE</div>
                                    <div className="list-info">
                                        <div>{data.duedate?TimeConversion.TIME(data.duedate):''}</div>
                                    </div>
                                </div>
								<div className="details-list">
									<div className="list-title">mtrocedures</div>
									<div className="list-info">
										<div>{data.mtrocedures}</div>
									</div>
								</div>
								<div className="details-list">
								<div className="list-title">opeprocedures</div>
								<div className="list-info">
									<div>{data.opeprocedures}</div>
								</div>
							</div>
								<div className="details-list">
									<div className="list-title">deferral Reference</div>
									<div className="list-info">
										<div>{data.deferralReference}</div>
									</div>
								</div>
                            </div>
                        </div>
                }

            </Content>
        )
    }
}


export default ManualMenu;