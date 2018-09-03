import './index.less';

import React,{Component} from 'react';
import {DatePicker,ActivityIndicator,ListView,Flex} from 'antd-mobile';
import Api from '../../../api/request';
import TimeConversion from '../../../utils/TimeConversion';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewTest from '../../../components/ListViewTest';
import PersonalGroup from './group';
import { TimeChoice } from '../../../components/TimeChoice';

const FlexItem = Flex.Item;

//  模拟数据
const array = [
	{
		title:'A',
		list:[
			{
				title:'ENGINEER',
				list:[
					{
						name:'ZHEN.LI',
					}
				]
			},{
				title:'技工',
				list:[
                    {
                        name:'MISS'
                    }
                ]
			}
		]
	},{
		title:'B',
		list:[
			{
				title:'ENGINEER',
				list:[
					{
						name:'ZHEN.LI',
					}
				]
			},{
				title:'技工',
				list:[
					{
						name:'MISS'
					}
				]
			}
		]
	},{
		title:'PVG',
		list:[
			{
				title:'ENGINEER',
				list:[
					{
						name:'ZHEN.LI',
					}
				]
			},{
				title:'技工',
				list:[
					{
						name:'MISS'
					}
				]
			}
		]
	}
];

class PersonalManage extends Component {
    constructor(props){
        super(props);
	    let nowDates = TimeConversion.date();
        this.state = {
            data:null,
	        nowDates,
        };

        this.timer = null;
	    this.url = 'scheduleday/dayuser';

	    this.dataSource = new ListView.DataSource({
		    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
	    });
    };

    componentDidMount(){
        this.update();
    }

    update = (assigndate = this.state.nowDates ) => {
    	this.setState({
		    data:null
	    },()=>Api.get(this.url,{assigndate,pageNow:1})
		    .then(res => {
			    if( res.errorCode == 0 ) {
				    this.setState({
					    data:res.data
				    });
			    };
		    })
	    );
    };

    /*
    * @param itemtype { string } 0 白班，1夜班
    * @param mlicense 证书号
    * @param type 1.普通管理员;2值班人员;3工程师
    * */

    rows = data => {
        return (
            <div className="personalGroup">
                <h2>{data.title}</h2>
                {
	                data.list.map((s,v) =>
                        <div className="personalGroup-list" key={v}>
                            <div className="title">
                                <p className="listLeft float">{s.title}</p>
                                <Flex
                                    className="listRight float"
                                >
                                    <FlexItem>Day</FlexItem>
                                    <FlexItem>Evening</FlexItem>
                                    <FlexItem>Rest</FlexItem>
                                </Flex>
                            </div>

                            {
	                            s.list.map((obj,m) =>
                                    <div className="listDetails" key={m}>
                                        <div className="listLeft float">
                                            <div className="people">
                                                    <span className="img">
                                                        <img src={require('../../../../static/images/287251719018053570.png')} alt=""/>
                                                    </span>
				                                {obj.name}
                                            </div>
                                        </div>
                                        <Flex
                                            className="listRight float"
                                        >
                                            <FlexItem className={obj.itemtype == '1'?'day':null}></FlexItem>
                                            <FlexItem className={obj.itemtype == '0'?'evening':null}></FlexItem>
                                            <FlexItem
	                                            className={obj.itemtype !='0' && obj.itemtype !='1' ?'rest':null}>

                                            </FlexItem>
                                        </Flex>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        )
    };

    updateTime = (obj) => {
        //console.log(obj);
        this.update(obj.nowDate);
    };


    render(){
    	const { data } = this.state;
    	//console.log(data);
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="Shift"/>
                <TimeChoice fn={this.updateTime} style={{zIndex:'1'}} />

	            <div className="personal-container">
		            {
			            !data?
				            <ActivityIndicator />:
				            data.length == 0?<div className="noData">No Data</div>:
				            <ListView
					            dataSource={this.dataSource.cloneWithRows(data)}
					            renderRow={this.rows}
					            initialListSize={data.length}
					            style={{
						            height:'85vh'
					            }}
				            />
		            }
	            </div>
            </Content>
        )
    }
}

export default PersonalManage;