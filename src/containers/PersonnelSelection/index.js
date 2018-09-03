import './index.css';

import React,{Component} from 'react';
import {Tabs,Toast,Radio,Modal,List,Flex} from 'antd-mobile';

import Api from '../../api/request';
import TimeConversion from '../../utils/TimeConversion';
import Native from '../../utils/Native';

import Content from '../../components/Content';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TimeChoice } from '../../components/TimeChoice';

import moment from 'moment';
//  默认值

const TabPane = Tabs.TabPane;
const RadioItem = Radio.RadioItem;
const FlexItem = Flex.Item;

const modalData = [
	{ value: 'Y', label: 'Y' },
	{ value: 'N', label: 'N' },
];
const data = () =>{
	let array = [];
	for (let i=0;i<30;i++) {
		array.push(i);
	}
	return array;
};
class PersonnelSelection extends Component {
    constructor(props){
        super(props);
        let nowDate = TimeConversion.date();
		let dpValue = moment(nowDate).locale('zh-cn').utcOffset(8);
        this.state = {
            dpValue,
            selectDay:0,
            selectNight:0,
            data:null,
            activeKey:'day',
            upUp:false,

			nowDate,

			modalType:false,
			valueType:'Y'
        }
    }

    componentWillMount(){
        this.update();
    }

    componentWillUnmount(){
        this.setState = _ => {};
    }

    update = _ => {
        Api.get('workorder/getEngineerAndOperator',{ assigndate:this.state.nowDate })
            .then(res => {
                if(res.data) {
                    this.setState({
                        data:res.data
                    });
                };
            })
    };

    componentDidMount(){

    	console.log(this.props);
        this.submit = _ => {
            _.preventDefault();
            //console.log(_.target.parentElement);
            let parent = _.target.parentElement;
            let arry = parent.getElementsByClassName('selected');
            let engineer = [],sysuser = [],daywork,nightwork;
            const { activeKey } = this.state;
            const { modal } = this.props;
            let nowDate = nowDates;
            activeKey == 'day'?daywork = 'Y':nightwork = 'Y';
            //console.log(arry);
            Array.from(arry).forEach(s=>{
                //console.log(s);
                engineer.push(s.dataset.engineer);
            });
            engineer = engineer.toString();
            sysuser = sysuser.toString();
            let obj = {
                engineer,
                assigndate:nowDate,
                daywork,
                nightwork
            };
            //console.log(obj);
            //  移交操作
            if (modal) {
                this.props.personnelFn(obj);
                return;
            };

            //console.log(obj);
            //return;
            Api.post('workorder/assignEnginnerWork',obj)
                .then(res => {
                    if (res.errorCode == 0) {
                        Native.alert(res.success);
                        console.log(res);
                    }
                });
        };
    }
    //  待优化处理 使用状态，问题：无法分清默认是否选中
    select = (_,obj) => {
        _.preventDefault();
        //console.log(obj);
        let clicked = _.target;
        let {selectDay,selectNight,activeKey} = this.state;
        //console.log(activeKey,selectDay,selectNight);
        if(clicked.className.indexOf('default') != -1){
            _.target.className = 'skill-people selected';
            activeKey == 'day'?selectDay++:selectNight++;
            this.setState({
                selectDay,
                selectNight
            });
        } else {
            _.target.className = 'skill-people default';
            activeKey == 'day'?selectDay--:selectNight--;
            this.setState({
                selectDay,
                selectNight
            });
        }
    };

    //取消排班
    cancel = _ => {
        let objCopy = {};
        for (let i in _) {
            objCopy[i] = _[i]
        }
        const {activeKey,upUp} = this.state;
        let obj = {
            engineer:_.engineer,
            assigndate:nowDates,
        };
        if(activeKey=='day') {
            _.daywork = 'N';
            obj.daywork = 'N';
        } else {
            _.nightwork = 'N';
            obj.nightwork = 'N';
        }
        // activeKey == 'day'?
        //     _.daywork = 'N'
        //     obj.daywork = 'N'
        // :()=>{
        //     console.log(3);
        //     _.nightwork = 'N';
        //     obj.nightwork = 'N';
        // };
        Api.post('workorder/assignEnginnerWork',obj)
            .then(res => {
                if (res.errorCode == 0) {
                    Toast.info('success',1,null,false);
                } else {
                    Toast.info('error',1,null,false);
                    if(activeKey=='day') {
                        _.daywork = 'Y';
                        obj.daywork = 'Y';
                    } else {
                        _.nightwork = 'Y';
                        obj.nightwork = 'Y';
                    }
                }

                this.setState({
                    upUp:!upUp
                });
            });
    };

	updateTime = (...obj) =>{
		this.setState(...obj);
	};

    handleTabClick = _ => {
        //console.log('onTabClick', _);
        this.setState({
            activeKey:_
        })
    };

	modalType = _ => {
		this.setState({
			modalType:true
		});
	};
	modalTypeCancel = _ => {
		//e.preventDefault();
		this.setState({
			modalType:false
		});
	};

	onChange = (valueType) => {
		this.setState({
			valueType,
			//modalType:false
		});
		//this.update();
	};

    callback = _ => {
        //console.log(_);
    };

    render(){
        let { nowDate,modalType ,valueType} = this.state;
        const { modal } = this.props;
        return (
			<Content
				style={{background:'#f5f5f9'}}
			>
				{
					modal?
						<div id="common-header">
							<div
								className="back"
								onClick={this.props.closeModal}
							>
							</div>
							<p className="title">SELECT PERSONNEL</p>
						</div>
						:
						<Header title="SELECT PERSONNEL"/>
				}
				<TimeChoice
					style={{position:'relative',top:'0'}}
					nowDate={nowDate}
					fn={this.updateTime}
					ref="time"
				/>

				<div
					className="manual-select personal"
					style={{position:'initial'}}
					ref="select"
				>
					<Flex className="mation-bottom">
						<FlexItem>
							<div className="mation-list" onClick={()=>this.modalType()}>
								<div className="icon icon-list-"></div>
								<p>1</p>
							</div>
						</FlexItem>
						<FlexItem>
							<div className="mation-list">
								<div className="icon icon-list-"></div>
								<p>2</p>
							</div>
						</FlexItem>
					</Flex>
				</div>

				<div className="peopleContainer">
					{
						data().map((s,v)=>
							<div className="people-group" key={v}>
								<h2 className="font26">A</h2>
								<div className="skill-group">
									<p className="skill-title">
										ENGINEER
									</p>
									<div
										className={
											`skill-people selected`
										}

										key={'2'}
										//data-engineer = {n.engineer}
									>
										<div className="skill-info">
											<p>BUN.LEE</p>
											<span className="skill-head"></span>
											<span className="skill-select"></span>
										</div>
									</div>
								</div>

								<div className="skill-group">
									<p className="skill-title">
										MECHANIC
									</p>
									<div
										className={
											`skill-people default`
										}
										key={'3'}
										//data-engineer = {n.engineer}
									>
										<div className="skill-info">
											<p>JACK.WONG</p>
											<span className="skill-head"></span>
											<span className="skill-select"></span>
										</div>
									</div>
								</div>
							</div>
						)
					}
				</div>

				<Modal
					visible={modalType}
					transparent
					onClose={this.modalTypeCancel}
					className="modalSelect"
				>
					<List>
						{
							modalData.map((s,v) =>
								<RadioItem
									key={s.value}
									checked={valueType === s.value}
									onChange={() => this.onChange(s.value)}
								>
									{s.label}
								</RadioItem>
							)
						}
					</List>
				</Modal>

			</Content>
        )
    }
}

export default PersonnelSelection;