/*LRU二维码扫描页面*/

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { currentAnimate } from '../../actions/currentAnimate';

import Native from '../../utils/Native';

import Content from '../Content';
import Header from '../Header';
import Scanning from '../../utils/Scanning';

import Api from '../../api/request';

class ScanningContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
			barcode:'',

	        loading:true,
        };

        this.timer = null;
	    this.barcode = null;

	    //this.url = 'lru/part';
    };

	componentWillMount(){

	};

    componentDidMount(){

	    let _this = this;
	    function plusReady(){
		    plus.key.addEventListener("backbutton",_this.props.fn);
	    };
	    if (window.plus) {
		    plusReady();
	    } else {
		    document.addEventListener("plusready",plusReady,false);
	    };
	    /*
	    * 样本格式
	    * MFR_D9240*SNR_461703*DMF_042017
	    * PNR_N40-2A10301-103
	    * PNR 2100-4043-02/SER 000580366/M6R 06141/DMF 112008
	    * DDMFR 97896SER CVR120-15386DMF 052012
	    * */
	    this.timer = setInterval(()=>{
		    this.barcode = Scanning.Pictures((type, bn) => {
			    if(bn) {
				    this.setState({
					    loading:false
				    },()=>{
				    	this.setState({
						    loading:true
					    });
					    //let bn = 'BN-17100001594';
					    //bn = bn.substr(bn.indexOf('-')+1);
					    console.log(bn,type);
					    let match = {};
					    let text = '';

					    if ( bn.indexOf('*') != -1) {
						    text = /SNR_[\S]*\*/.exec(bn)[0];
						    text = text.replace('*','');
						    text = text.replace('SNR_','');
						    match = {snno:text};
					    } else if (bn.indexOf('/') != -1) {
						    text = /PNR [\S]*\//.exec(bn)[0];
						    text = text.replace('PNR ','');
						    text = text.replace('/','');
						    match = {pnno:text};
					    } else if (bn.indexOf('PNR_') != -1) {
						    text = bn.replace('PNR_','');
						    match = {pnno:text};
					    } else {
					    	Native.alert('Unrecognized',()=>{
							    this.props.fn();
					    		return;
						    });
					    }

					    // Api.post(this.url,{bn})
						 //    .then(res => {
							//     if (res.errorCode == 0) {
							// 	    this.props.getPn(res.data.part);
							//     } else {
							// 	    Native.alert('扫描失败！');
							//     }
					    //
							//     //
							//     this.setState({
							// 	    loading:false
							//     },this.props.fn);
						 //    });
					    this.props.getPn({...match});
					    this.props.fn();
				    });
			    };
		    });
		    clearInterval(this.timer);
	    },MS);
    };

	componentWillUnmount(){
		let _this = this;
		function plusReady(){
			plus.key.removeEventListener("backbutton",_this.props.fn);
			plus.key.addEventListener("backbutton",_this.onBack);
		};
		if (window.plus) {
			plusReady();
		} else {
			document.addEventListener("plusready",plusReady,false);
		};
		clearInterval(this.timer);
		this.barcode?this.barcode.close():null;
	};

	onBack = _ => {
		this.props.dispatch(currentAnimate('right'));
		this.props.history.goBack();
	};

    render(){
    	const { loading } = this.state;
        return (
            <Content
                style={{paddingBottom:0,background: 'black'}}
            >
	            <div
		            id="common-header"
	            >
		            <div
			            className="back"
			            onClick={ this.props.fn }
		            >
		            </div>
		            <p className="title">Scanning</p>
	            </div>
                <div id="barcode" className="barcode">

                </div>

	            <ActivityIndicator
		            toast
		            text="Loading..."
		            animating={ loading }
	            />
            </Content>
        )
    }
};

ScanningContainer = connect()(ScanningContainer);
ScanningContainer = withRouter(ScanningContainer);
export default ScanningContainer;