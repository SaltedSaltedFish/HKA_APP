import './index.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';

class AircraftStatus extends Component {
    constructor(){
        super();
        this.state = {
            data:[],
            isRequest:true
        }
    }

    componentWillMount(){
        // const cardid = this.props.location.search.replace('?','');
        // Api.post('manual/amm/card',{cardid})
        //     .then(res => this.setState({
        //         data:res.data,
        //         isRequest:false
        //     }))
    };

    render(){
        const {isRequest} = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="TECHNIC"/>

                {
                    !isRequest?<ActivityIndicator />:
                        <div className="manual-three">
                            <div className="manual-title">
                                A330-A
                                <span>OPEN</span>
                            </div>

                            <div className="manual-describe">
                                <p style={{color:'#b5b4bc'}}>Defect Desc</p>
                                <p>Description of defects is shown here,description of defects is shown here</p>
                            </div>

                            <div className="manual-list">
                                <div className="details-list">
                                    <div className="list-title">
                                        ETD
                                    </div>
                                    <div className="list-info">
                                        <div>8:00am</div>
                                    </div>
                                </div>
                                <div className="details-list">
                                    <div className="list-title">
                                        ETD
                                    </div>
                                    <div className="list-info">
                                        <div>8:00am</div>
                                    </div>
                                </div>

                                <div className="details-list">
                                    <div className="list-title">
                                        ETD
                                    </div>
                                    <div className="list-info">
                                        <div>8:00am</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </Content>
        )
    }
}


export default AircraftStatus;