import './index.less';

import React,{Component} from 'react';
import { Flex,Modal,Carousel,ActivityIndicator } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import Api from '../../../api/request';
import {TimeConversion} from '../../../utils/TimeConversion';

const FlexItem = Flex.Item;

class SecurityLog extends Component {
    constructor(props){
        super(props);
        //console.log(props);
        let data = props.location.search.replace('?','').split('&');
	    let condition = {
		    acreg:data[0],
		    flightnum:data[1],
		    flightdate:data[2]

	    };
        // let condition = {
        //     acreg:data.acreg||'BLGA',
	     //    flightnum:data.fltid || 'HX0239',
	     //    flightdate:data.flightdate || '2018-01-03',
        //
        // };
        this.state = {
            data:false,
            modalVisible:false,
            files:[],
	        condition
        };
        this.aclogid = data[3];
    };

    componentWillMount(){

    };

    componentDidMount(){
	    Api.post('acflight/tlb/list',this.state.condition)
		    .then(res => {
			    //console.log(res);
			    this.setState({
				    data:res.data
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

    rows = data => {
        return (
            <div key={data.tlbid} className="flight-list">
                <Link
                    to={{
                        pathname:'/security_de',
                        search:'?' + this.aclogid + '&' + data.tlbid + '&' + data.acreg + '&' + data.sign
                    }}
                >
                    <div className="departuresone">
                        <Flex
                            justify="end"
                            style={{paddingBottom:'0.3rem'}}
                        >
                            <FlexItem className="fltno">ACTYPE:</FlexItem>
                            <FlexItem className="fltid">{data.actype}</FlexItem>
			                {/*<FlexItem></FlexItem>*/}
                            <FlexItem className="fltno" style={{marginLeft:'0.3rem'}}>ACREG:</FlexItem>
                            <FlexItem className="fltid">{data.acreg}</FlexItem>
                        </Flex>
                        <Flex
                            justify="end"
                            style={{paddingBottom:'0.3rem'}}
                        >
                            <FlexItem className="fltno">FLIGHT:</FlexItem>
                            <FlexItem className="fltid">{data.flightnumber}</FlexItem>
                            <FlexItem className="fltno" style={{marginLeft:'0.6rem'}}>LP:</FlexItem>
                            <FlexItem className="fltid">{data.lpnum}</FlexItem>
                        </Flex>
                    </div>

                    <div className="departurestwo">
                        <div style={{height:'0.3rem'}}>
                            <div className="hka">{data.depstn}</div>
                            <div className="hkatosk"></div>
                            <div className="sk">{data.arrstn}</div>
                        </div>
                    </div>
                </Link>
            </div>
        )
    };

    render(){
        //console.log(this.props);
        const { data,files,modalVisible,condition} = this.state;
        let y_m_d;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="TLB PAGE" />

                {
                    data?data.length > 0 ?
                        data.map((s,v)=> this.rows(s)): <div className="noData hasPadding">No Data</div>
                        :<ActivityIndicator />
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

SecurityLog = connect(state => ({
	flightState:state.ArrivalsState
}))(SecurityLog);
export default SecurityLog;