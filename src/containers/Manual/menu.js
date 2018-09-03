import './menu.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../components/Header';
import Content from '../../components/Content';

import Api from '../../api/request';

class ManualMenu extends Component {
    constructor(){
        super();
        this.state = {
            data:[],
            isRequest:true
        }
    }

    componentWillMount(){
        const cardid = this.props.location.search.replace('?','');
        Api.post('manual/amm/card',{cardid})
            .then(res => this.setState({
                data:res.data,
                isRequest:false
            }))
    };

    imgSrc = Obj =>{
        let obj = Obj.toString();
        if (obj.indexOf('<img') != -1) {
            obj = obj.replace(/src='/,"src='"+httpRequest);
            console.log(obj);
        }

        return obj;
    };

    render(){
        const {data,isRequest} = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="AMM"/>
                {
                    isRequest?<ActivityIndicator />:
                        <div className="manual-three">
                            {
                                data.map((s,v)=>
                                    {
										s.body = this.imgSrc(s.body);
                                        return (
                                            <div
                                                dangerouslySetInnerHTML={{__html:s.body}}
                                                key={v}
                                                className="manual-describe"
                                            >

                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                }

                {/*<div className="manual-title">*/}
                {/*A330-A*/}
                {/*<span>OPEN</span>*/}
                {/*</div>*/}

                {/*<div className="manual-describe">*/}
                {/*<p style={{color:'#b5b4bc'}}>Defect Desc</p>*/}
                {/*<p>Description of defects is shown here,description of defects is shown here</p>*/}
                {/*</div>*/}

                {/*<div className="manual-list">*/}
                {/*<div className="details-list">*/}
                {/*<div className="list-title">*/}
                {/*ETD*/}
                {/*</div>*/}
                {/*<div className="list-info">*/}
                {/*<div>8:00am</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*<div className="details-list">*/}
                {/*<div className="list-title">*/}
                {/*ETD*/}
                {/*</div>*/}
                {/*<div className="list-info">*/}
                {/*<div>8:00am</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*<div className="details-list">*/}
                {/*<div className="list-title">*/}
                {/*ETD*/}
                {/*</div>*/}
                {/*<div className="list-info">*/}
                {/*<div>8:00am</div>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*</div>*/}
            </Content>
        )
    }
}


export default ManualMenu;