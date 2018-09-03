import './index.css';

import React,{Component} from 'react';
import { TabBar} from 'antd-mobile';
import { currentAnimate } from '../../actions/currentAnimate';
import { connect } from 'react-redux';

import Index from '../Index';
import WorkOrder from '../WorkOrderManage/WorkOrder';
import WorkOrder_Staff from '../WorkOrderManage/WorkOrder_Staff';

/**/
import FlightList from '../Flight/FlightList';
/**/
import Information from '../PersonalCenter/Information';
import Manual from '../Manual';

//  安卓返回键监控
let first = null;
function onbackQuit () {
    if (!first) {
        first = new Date().getTime();
        plus.nativeUI.toast('Press exit application again',{duration:"1000"});
        setTimeout(function() {
            first = null;
        }, 1000);
    } else {
        if (new Date().getTime() - first < 1000) {
            plus.runtime.quit();
        }
    }
};

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedTab: tabs,
            hidden: false,
        };
    }

    quitAPP = _ =>{
        //console.log(_);
        let first = null;
        if (!first) {
            first = new Date().getTime();
            plus.nativeUI.toast('Press exit application again',{duration:"1000"});
            setTimeout(function() {
                first = null;
            }, 1000);
        } else {
            if (new Date().getTime() - first < 1000) {
                plus.runtime.quit();
            }
        }
    };

    componentWillMount(){
		//this.PushGet('45048,3')
    };

    componentDidMount(){
    	//console.log(this);

	    this.props.dispatch(currentAnimate('left'));

    	let _this = this;
        function plusReady(){
            plus.key.removeEventListener("backbutton",_this.onBack);
            plus.key.addEventListener("backbutton",onbackQuit);

			plus.push.addEventListener('click',function(msg){
				if(msg.aps){
					let push_page = msg.payload;
					_this.PushGet(push_page);
					//plus.runtime.setBadgeNumber(0);
				}else{
					let push_page = msg.payload;
					push_page = eval('('+push_page+')');
					PushGet(push_page);
				}
			});

			plus.push.addEventListener('receive',function(msg) {
				if (msg.payload.indexOf("local:'true'") == -1) {
					let push_ios = msg.payload;
					push_ios = eval('('+push_ios+')');
					_this.PushGet (msg.payload);
					plus.push.createMessage(push_ios.content,push_ios.payload.replace(",",",localhost,"));
					sessionStorage.push_receive = null;
				}
			});
        };

        if(window.plus){
            plusReady();
        }else{
            document.addEventListener("plusready",plusReady,false);
        }
    };

    componentWillUnmount(){
    	let _this = this;
        //backbutton = this.props;
        function plusReady(){
            plus.key.removeEventListener("backbutton",onbackQuit);
            plus.key.addEventListener("backbutton",_this.onBack);
        }
        if (window.plus) {
            plusReady();
        } else {
            document.addEventListener("plusready",plusReady,false);
        }
    };

	onBack = _ => {
		this.props.dispatch(currentAnimate('right'));
		this.props.history.goBack();
	};

	PushGet = obj => {
		let array = obj.split(',');
		console.log(array);
		/**
		 * 规则 接收推送
		 * @param {object} string 推送过来的所有信息
		 * @param 0 string	指派
		 * @param 1	string	移交
		 * @param 2	string	延期申请
		 * @param 3 string	延期审批
		 * @param 4 string	告警
		 */
		switch (array[1]) {
			case "0":
				this.props.history.push('/work_details?id='+array[0]);
				break;
			case "1":
				this.props.history.push('/work_details?id='+array[0]);
				break;
			case "2":
				this.props.history.push('/application_details?id='+array[0]);
				break;
			case "3":
				this.props.history.push('/my_application_details?id='+array[0]);
				break;
			case "5":
				this.props.history.push('/news_alarm?id='+array[0]);
				break;
			default :
				return '';
				break;
		}
	};

    render(){
        let { selectedTab,hidden } = this.state;

        tabs = selectedTab;

        const boolean = (selectedTab == 'index');

        //console.log(selectedTab);

        let identity = Boolean(Number(localStorage.identity));
        return (
            <div className={boolean?'index':'unIndex'}>
                <TabBar
                    barTintColor={boolean?"transparent":"#312f35"}
                    hidden={hidden}
                    tintColor={'#c83a36'}
                    unselectedTintColor={`white`}
                >
                    <TabBar.Item
                        key="home"
                        title={'Home'}
                        icon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        selectedIcon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        selected={selectedTab === 'index'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'index',
                            });
                        }}
                        data-seed="logId"
                        data-index="index"
                    >
                        <Index />
                    </TabBar.Item>
                    <TabBar.Item
	                    title={'Works'}
                        icon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        selectedIcon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        key="log"
                        selected={selectedTab === 'log'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'log',
                            });
                        }}
                        data-seed="logId1"
                        data-index="log"
                    >

                        {
                            identity?<WorkOrder />:<WorkOrder_Staff />
                        }
                    </TabBar.Item>
                    <TabBar.Item
	                    title={'Flights'}
                        icon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        selectedIcon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        key="flight"
                        selected={selectedTab === 'flight'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'flight',
                            });
                        }}
                        data-index="flight"
                    >
	                    <FlightList />
                    </TabBar.Item>
                    <TabBar.Item
	                    title={`Manuals`}
                        icon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        selectedIcon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        key="search"
                        selected={this.state.selectedTab === 'search'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'search',
                            });
                        }}
                        data-index="search"
                    >
                        <Manual />
                    </TabBar.Item>
                    <TabBar.Item
	                    title={'My'}
                        icon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        selectedIcon={{ uri: '../../../dist/1rqojMODm0.png' }}
                        key="myself"
                        selected={selectedTab === 'myself'}
                        onPress={() => {
                            this.setState({
                                selectedTab: 'myself',
                            });
                        }}
                        data-index="myself"
                    >
                        <Information />
                    </TabBar.Item>
                </TabBar>
            </div>
        );
    }
}

Home = connect()(Home);
export default Home;