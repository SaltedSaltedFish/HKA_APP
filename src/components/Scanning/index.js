import './index.less';

import React,{ Component } from 'react';
import { Modal,Button,ActivityIndicator } from 'antd-mobile';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import Content from '../Content';
import Header from '../Header';
import Scanning from '../../utils/Scanning';

import TimeConversion from '../../utils/TimeConversion';
import { TimeCHOICE } from '../../components/TimeChoice';
import Api from '../../api/request';
import Native from '../../utils/Native';

class ScanningContainer extends Component {
    constructor(props){
        super(props);

        let isFe = props.location.search.replace('?','').split(',') || false;

        let assigndate = isFe[0] || TimeConversion.date();

        this.state = {
			barcode:'',
            modalVisible:false,
	        assigndate,
	        isLoading:false,

	        dataSource:{},
	        isFe,   //  是否是从反馈页面过来
        };

        this.timer = null;
	    this.barcode = null;
    };

    componentDidMount(){
	    this.barcode = Scanning.Pictures((type, text) => {
		    const { isFe } = this.state;

		    if(text) {
			    if ( isFe.length > 1 ) {
				    if ( isFe[1] != text) {

					    Modal.alert('Disagreement with the work list of feedback','',[{text:'OK',
						    onPress:()=> this.barcode.start()}]);
					    return;
				    };

				    this.obtain(text,this.state.assigndate);
			    } else {
				    this.setState({
					    barcode:text,
					    modalVisible:true
				    })
			    };
			    this.barcode.close();
		    };
	    });

    };

	componentWillUnmount(){
		clearInterval(this.timer);
		this.barcode?this.barcode.close():null;
	};

	updateTime = (obj) =>{
		this.setState({assigndate:obj.nowDate});
	};

	//  启动二维码扫描
	startPictures = (fn) => {

	};

	obtain = (barcode ,assigndate) => {
		//this.props.history.push({pathname:'/sca_job_feedback?WOPPC1800012_1,2018-01-23', query: { the: 'query' }});

		console.log(this.state);

		this.setState({
			modalVisible:false,
			isLoading:true,
		});

		//barcode = 'WOPPC18000065_2';
		//assigndate = '2018-03-23';

		Api.get('workorder/getScanWorkOrder',{ barcode,assigndate })
			.then( res=> {
				/*
				* feedbacked 是否反馈过
				* isLru 是否需要录入LRU
				* dataSource 扫描获取的数据源
				* */
				let feedbacked = false,isLru = false,dataSource = {},
					{ isFe } = this.state;

				console.log(res);

				if (res.errorCode == 0) {
					if(res.data.scanWorkOrderInfo) {
						if (res.data.scanWorkOrderInfo.taskcompletion == "N" || res.data.scanWorkOrderInfo.taskcompletion == "Y") {
							console.log('已经反馈');
							Modal.alert('Already feedback');
							isLru = res.data.partInfo ? res.data.partInfo : false;
						} else {
							if (!res.data.scanWorkOrderInfo.engineer) {
								console.log(JSON.stringify(res) + barcode + assigndate);
								Modal.alert('Unassigned');
							} else {
								isLru = res.data.scanWorkOrderInfo.partInfo ? res.data.scanWorkOrderInfo.partInfo : false;
								feedbacked = true;
								console.log('可以反馈');
							};
						};

						//console.log(feedbacked,isLru);

						this.setState({
							isLoading:false,
						},()=>{
							if ( feedbacked ) {

								if ( isFe ) {
									this.props.history.replace('/job_feedback?' + JSON.stringify(res.data));
								} else {
									this.props.history.push('/job_feedback?' + JSON.stringify(res.data));
								};

							} else {
								this.barcode.start();
							};

							//feedbacked?
							//this.props.history.push('/job_feedback?' + JSON.stringify(res.data)):this.barcode.start();
						});

					}else {

						this.setState({
							isLoading:false,
						},() => this.barcode.start());

						Modal.alert('Data does not exist');
					};

				}else {

					this.setState({
						isLoading:false,
					},() => this.barcode?this.barcode.start():null);

					Modal.alert(res.errorMsg);
				};

			});
	};

    render(){

        const { barcode,modalVisible,assigndate,isLoading} = this.state;

        return (
            <Content
                style={{paddingBottom:0,background: 'black'}}
            >
                <Header
					title="Scanning"
					style={{zIndex:'1000'}}
				/>
                <div id="barcode" className="barcode">

                </div>

                <Modal
					title="选择分配日期"
                    visible={modalVisible}
					transparent
					className="datePickerView"
                >
					<TimeCHOICE fn={this.updateTime} nowDate={assigndate}/>

					{/*<Link*/}
						{/*to={{*/}
							{/*pathname:'/sca_job_feedback',*/}
							{/*state:{*/}
								{/*nowDate,barcode*/}
							{/*}*/}
						{/*}}*/}
						{/*className="am-button am-button-primary am-button-small"*/}
						{/*style={{width:'30%',margin:'.2rem auto 0'}}*/}
					{/*>*/}
						{/*OK*/}
					{/*</Link>*/}
					<div
						className="am-button am-button-primary am-button-small"
						style={{width:'30%',margin:'.2rem auto 0'}}
						onClick={ ()=> this.obtain(barcode,assigndate) }
					>
						OK
					</div>
                </Modal>

	            <ActivityIndicator
		            toast
		            text="Loading..."
		            animating={ isLoading }
	            />
            </Content>
        )
    };
};

ScanningContainer = withRouter(ScanningContainer);
export default ScanningContainer;