import './Assigned.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import { ListView ,Flex} from 'antd-mobile';
import {connect} from 'react-redux';

import Api from '../../../api/request';
import getState from '../../../utils/getState';
import { adminRelation } from '../../../actions/workOrder';

import ListViewComponent from '../../../components/ListView';


let conditions = {};    //  保存条件
const FlexItem = Flex.Item;

class Undistributed extends Component {
    constructor(props){
        super(props);
        //console.log(props);
        let condition = {
			flightdate:props.flightdate,
			acreg:props.acreg,
			station:'HKG'
		};
        this.state = {
            dataSource:false,
            refreshing:false,
            isLoading:true,
            nums:10,
            pageNow:2,
            taskState:'',
            hasMore:false,
            totalPageSize:0,
            rollingState:false,
            condition,
            isUpdate:false,

            timer:{},

			array:[]
        };

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
		this.url = 'workorder/getFlightWork';
    }

    componentWillMount(){
		if(this.props.state){
			this.setState({
				...this.props.state
			});
			return;
		};
        this.update(this.state.condition);
    }

    componentWillUnmount(){
		this.props.dispatch(adminRelation({
			...this.state
		}));
        clearTimeout(this.state.timer);
        this.setState = _ => {};
    }

    componentDidMount(){
        //this.refs.lv.scrollTo(0,100);
    }

    componentWillReceiveProps(props){
    	console.log(props);
        const { condition } = this.state;
		condition.flightdate = props.flightdate;
		condition.acreg = props.acreg;
        //conditions = condition;
        this.setState({
			condition
		},()=> this.update(condition));
    };

    update = (condition,bl) => {
        condition.pageNow = 1;
        if (!bl) {
			this.setState({
				dataSource:false
			});
        };
        return Api.get(this.url,condition)
            .then(res => {
                if(res.errorCode == 0) {
                    let data = res.data;
                    this.state.array = data;
                    this.state.timer = setTimeout(()=>
                    {
	                    this.state.dataSource = false;
	                    this.setState({
		                    dataSource:this.dataSource.cloneWithRows(data),
		                    totalPageSize:0,
		                    hasMore:false,
		                    pageNow:2
	                    })
                    },100)
                } else {
					this.setState({
						dataSource:this.dataSource.cloneWithRows([]),
						hasMore:false,
					})
				};
            })
    };

    //  下拉
    onRefresh = () => {
		const { condition } = this.state;
        this.setState({ refreshing: true });
        this.update(condition,true)
            .then( _ => {
                this.setState({
                    refreshing: false
                });
            })
    };

    onEndReached = () =>{
		const { condition } = this.state;
        let {isLoading,pageNow,hasMore,totalPageSize} = this.state;

        if(totalPageSize < pageNow ){
            this.setState({
                hasMore:true
            });

            return;
        }

        this.setState({
            rollingState:true
        });

        if(isLoading && !hasMore) {
            this.state.isLoading = false; //  改变但不刷新状态
			condition.pageNow = pageNow;
            //console.log(conditions);
            Api.get(this.url,condition)
                .then(res => {
                    if(res.errorCode == 0) {
                        let data = res.pageInfo.pageData;
						this.state.array.push(...data);
                        pageNow+=1;
                        this.setState({
                            dataSource:this.dataSource.cloneWithRows(this.state.array),
                            pageNow:pageNow,
                            isLoading:true,
                            rollingState:false
                        })
                    }
                });
        }
    };

    onScroll = (e) => {
        //console.log(e,e.scroller.getValues().top);
        this.st = e.scroller.getValues().top;
        this.domScroller = e;
    };

    rows(s,v,condition){
        let state = getState.state(s.taskcompletion?s.taskcompletion:'');
        //console.log(condition.filterType,'----------------------',state);
        //console.log(typeof state,typeof condition.filterType);
        if(condition.filterType && condition.filterType != '' && condition.filterType !== state){
            return null;
        }
        return (
            <Link
                to={{
                    pathname: '/details_relation',
                    state:s,
                    search:'?woid='+s.woid + '&' + condition.flightdate +'&'+ condition.acreg
                }}
            >
                <div
                    className="work-list"
                    key={v}
                >
                    {/*<span className="lv">{s.priority?s.priority:'C'}</span>*/}
                    <div className={`state ${state}`}>
                        <div></div>
                        <p>{state}</p>
                    </div>
                    <div className="list-top" style={{border:'none'}}>
                        <div className="introduction">
                            <p className="title">{s.wono}</p>
                            <p className="list-color1">Acreg：{s.acreg} </p>
                        </div>
                    </div>
                    {/*<div*/}
                        {/*className="list-bottom"*/}
                        {/*dangerouslySetInnerHTML={{__html:s.disp}}*/}
                    {/*>*/}

                    {/*</div>*/}
                </div>
            </Link>
        )
    }

    render(){
        const {refreshing,dataSource,hasMore,condition,rollingState} = this.state;
        return (
            <div style={{
                padding:'0 .3rem'
            }}>
				<ListViewComponent
					dataSource={dataSource}
					hasMore={hasMore}
					rollingState={rollingState}
					rows={(s,v)=> this.rows(s,v,condition)}
					refreshing={refreshing}
					onScroll={this.onScroll}
					onRefresh={this.onRefresh}
					onEndReached = {this.onEndReached}
				/>
            </div>
        )
    }
}

Undistributed = connect(state => {return {
    state:state.AdminWorksheetList.relation
}})(Undistributed);
export default Undistributed;