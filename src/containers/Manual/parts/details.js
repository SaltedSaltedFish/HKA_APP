import '../menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';

class ManualMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:[],
            isRequest:true
        }
    }

    componentWillMount(){
        const addid = this.props.location.search.replace('?','');
        Api.get('add/getAddInfo',{ addid })
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
                <Header title="PartsDetails"/>
                {
                    isRequest?<ActivityIndicator />:
                        <div className="manual-three">
                            <div className="manual-title">
                                {data.acreg}
                                <span className={data.state}>{data.state}</span>
                            </div>
                            <div className="manual-describe">
                                <p style={{color: '#b5b4bc'}}>Defect Desc</p>
                                <p>{data.defectDesc}</p>
                            </div>

                            <div className="manual-list">
                                <div className="details-list">
                                    <div className="list-title">CAT</div>
                                    <div className="list-info">
                                        <div>{data.cat}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">ADD NO.</div>
                                    <div className="list-info">
                                        <div>{data.addno}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">DueUpdatedWhen</div>
                                    <div className="list-info">
                                        <div>{data.dueUpdatedWhen}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">FlightNumber</div>
                                    <div className="list-info">
                                        <div>{data.flightnumber}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">PlanDate</div>
                                    <div className="list-info">
                                        <div>{data.plandate}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">References</div>
                                    <div className="list-info">
                                        <div>{data.references}</div>
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