import './index.css';

import React,{Component} from 'react';
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Api from '../../../api/request';

class AcStatus extends Component {
    constructor(props){
        super(props);
        //let data = props.location.state;
        this.state = {
            data,
            modalVisible:false,
            files:[]
        };
    };
    componentWillUnmount(){
        this.setState = _ => {};
    }
    render(){
     const { data }=this.state;
     console.log(data);
        return (
            <Content
                style={{paddingBottom:0}}
                className="ac"
            >
                <Header title="AC STATUS"/>
                <div className="list-container">
                    {
                        data.length >0?
                            <div className="details-list">
                                <div className="list-title">
                                    ata
                                </div>
                                <div className="list-info">
                                    <div>1</div>
                                </div>
                            </div>:
                            <div className="noData hasPadding">No Data</div>
                    }
                </div>

            </Content>
        )
    }
}

export default AcStatus;