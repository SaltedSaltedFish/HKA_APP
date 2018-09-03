import './index.less';

import React,{Component} from 'react';
import {Flex,Modal,Carousel,ActivityIndicator} from 'antd-mobile';
import { Link } from 'react-router-dom';
import Api from '../../../api/request';
import {connect} from 'react-redux';
import {TimeConversion} from '../../../utils/TimeConversion';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

const FlexItem = Flex.Item;

class SecurityLogDetails extends Component {
    constructor(props){
        super(props);
        let data = props.location.state || {};
        let param = props.location.search.replace('?','').split('&');
        let aclogid = param[0];
        let tlbid = param[1];
        let acreg = param[2];
        let sign = param[3];

        let condition = {
	        tlbid
        };

        this.state = {
            dataArray:false,
            modalVisible:false,
            files:[],
	        condition
        };

        this.transmit = {
            acreg,
	        aclogid,
	        tlbid,
	        sign
        };
    };

    componentWillMount(){

    };

    componentDidMount(){
	    Api.post('acflight/defect/list',this.state.condition)
		    .then(res => {
			    //console.log(res);
			    this.setState({
				    dataArray:res.data
			    });
		    })
    };

    componentWillUnmount(){
        this.setState = _ => {};
    };

    onImageClick = (...obj) => {
        let { files } = this.state;
        files.push(...obj);
        files.map((s,v)=>{
            if(!s) {
                files.length = v
            }
        });
        this.setState({
            modalVisible:true,
            files:files
        })
    };

    onClose = _ => {
        this.setState({
            modalVisible:false,
            files:[]
        })
    };

    rows = (obj,index) => {
        let y_m_d = obj.createdwhen?obj.createdwhen.split(' ')[0]:' - ';
        return (
            <div className="securityList" key={index}>
                <div className="securityDescribe">
                    <div className="time">
                        <p>{y_m_d.split('-')[1]}.{y_m_d.split('-')[2]}</p>
                        <p>{y_m_d.split('-')[0]}</p>
                    </div>
                    <div className="describe">
                        <p
                            className="title"
                            style={{
						        minHeight:'.4rem'
					        }}
                        >
					        {obj.defectType || ''}
                        </p>
                        <p style={{
					        minHeight:'.5rem'
				        }}>
					        {obj.defectDesc}
                        </p>
                    </div>
                </div>

                <div className="details-list">
                    <div className="list-title">
                        Created:{ obj.createdby }
                    </div>
                    <div className="list-info">
				        {/*<span className="img"></span>*/}
                    </div>
                </div>

		        {
			        !obj.photo1?null:
                        <Flex
                            className="securityImg"
                            onClick={ _=>this.onImageClick(obj.photo1,obj.photo2,obj.photo3) }
                        >
                            <FlexItem>
                                <img src={httpRequest + obj.photo1} alt=""/>
                            </FlexItem>
                            <FlexItem style={!obj.photo2?{background:'transparent'}:null}>
						        {
							        obj.photo2?
                                        <img src={httpRequest + obj.photo2} alt=""/>:null
						        }
                            </FlexItem>
                            <FlexItem style={!obj.photo3?{background:'transparent'}:null}>
						        {
							        obj.photo3?
                                        <img src={httpRequest + obj.photo3} alt=""/>:null
						        }
                            </FlexItem>
                        </Flex>
		        }
            </div>
        )
    };

    render(){
        const { data,dataArray,files,modalVisible,condition} = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="LOG" />

                <div className="transmit icon icon-task">
                    <Link
                        to={{
		                    pathname: '/report_fault',
		                    search:'?'+this.transmit.aclogid + '&' + this.transmit.acreg + '&' + this.transmit.tlbid
                            + '&' + this.transmit.sign,
	                    }}
                    />
                </div>
                {
	                dataArray?dataArray.length > 0 ?
                        dataArray.map( (s,v) => this.rows(s,v) ):
                        <div className="noData hasPadding">No Data</div>:<ActivityIndicator />
                }


                <Modal
                    transparent
                    visible={modalVisible}
                    onClose={this.onClose}
                    style={{width:'7rem'}}
                >
                    <Carousel
                        className="my-carousel"
                        key={files.length}
                    >
                        {
                            files.map((ii,v) =>
                                <img
                                    key={v}
                                    src={httpRequest+ii}
                                />
                            )
                        }
                    </Carousel>
                </Modal>

            </Content>
        )
    }
}

export default SecurityLogDetails;