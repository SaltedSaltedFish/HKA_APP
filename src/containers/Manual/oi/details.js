import '../menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';

class OiManualMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:this.props.location.state.s,
            isRequest:false
        }
    }

    componentWillMount(){
    };

    render(){
        const {data,isRequest} = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="OiDetails"/>
                {
                    isRequest?<ActivityIndicator />:
                        <div className="manual-three">
                            <div className="manual-title">
                                ACREG
                                <span className={data.state}> {data.acreg}</span>
                            </div>
                            <div className="manual-describe">
                                <p style={{color: '#b5b4bc'}}>AIREVTTEXT</p>
                                <p>{data.airevtext}</p>
                            </div>

                            <div className="manual-list">
                                <div className="details-list">
                                    <div className="list-title">CAT</div>
                                    <div className="list-info">
                                        <div>{data.cat}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">FLIGHTNO</div>
                                    <div className="list-info">
                                        <div>{data.flightno}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">DEPARTDATE</div>
                                    <div className="list-info">
                                        <div>{data.departdate}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">STATION</div>
                                    <div className="list-info">
                                        <div>{data.station}</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">LP#</div>
                                    <div className="list-info">
                                        <div>{data.lpnum}</div>
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


export default OiManualMenu;