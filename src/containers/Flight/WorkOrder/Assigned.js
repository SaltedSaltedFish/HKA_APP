import './Assigned.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import Api from '../../../api/request';
import { RefreshControl, ListView ,Flex,ActivityIndicator} from 'antd-mobile';
import getState from '../../../utils/getState';
import {connect} from 'react-redux';
import { adminState } from '../../../actions/workOrder';

let arry = [];
const FlexItem = Flex.Item;
const url = 'workorder/getWorkOrderList';

const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

class Assigned extends Component {
    constructor(){
        super();
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
            condition:{},
            isUpdate:false,
        };
    }

    componentWillMount(){
        if(this.props.assigend.state){
            const state = this.props.assigend.state;
            this.setState({
                dataSource:state.dataSource,
                totalPageSize:state.totalPageSize,
                pageNow:state.pageNow,
                hasMore:state.hasMore,
                isLoading:state.isLoading,
                flightDate:state.flightDate,
                rollingState:state.rollingState
            });
            return;
        }

        this.update();
    }

    componentWillUnmount(){
        //console.log('销毁工单');
        const {pageNow,dataSource,totalPageSize,hasMore,isLoading,rollingState} = this.state;
        this.props.dispatch(adminState({
            dataSource,
            totalPageSize,
            pageNow,
            hasMore,
            isLoading,
            rollingState,
        }));
        this.setState = _ => {};
    }

    componentDidMount(){
        //this.refs.lv.scrollTo(0,100);
    }

    componentWillReceiveProps(condition){
        //console.log(condition);
        // this.setState({
        //     condition,
        //     isUpdate:!this.state.isUpdate
        // })
        this.refs.lv.scrollTo(0,0);
        this.setState({
            dataSource:dataSource.cloneWithRows(arry),
            condition
        });
    };

    update = _ => {
        //console.log(_); 这边拿到所有的状态，然后进行筛选，以减少服务器请求
        return Api.get(url,{pageNow:1,taskState:''})
                .then(res => {
                    //console.log(res);
                    if(res.errorCode == 0) {
                        let data = res.pageInfo.pageData;
                        let num = res.pageInfo.pageData.length;
                        //console.log(data,num);
                        arry = data;
                        this.setState({
                            dataSource:dataSource.cloneWithRows(arry),
                            totalPageSize:res.pageInfo.totalPageSize,
                            hasMore:false,
                            pageNow:2
                        })
                    }
                })
    };

    //  下拉
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.update(false)
            .then( _ => {
                this.setState({
                    refreshing: false
                });
            })
    };

    onEndReached = () =>{
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
            Api.get(url,{pageNow:pageNow,taskState:''})
                .then(res => {
                    if(res.errorCode == 0) {
                        let data = res.pageInfo.pageData;
                        arry.push(...data);
                        pageNow+=1;
                        this.setState({
                            dataSource:dataSource.cloneWithRows(arry),
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

    renderCustomIcon() {
        return [
            <div key="0" className="am-refresh-control-pull">
                <span>Pull down to refresh</span>
            </div>,
            <div key="1" className="am-refresh-control-release">
                <span>Release to refresh</span>
            </div>,
        ];
    };

    renderCustomLoading(){
        return [
            <div key="0">
                <ActivityIndicator />
            </div>
        ]
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
                    pathname: '/work_details',
                    search: '?id='+ s.assignworkid,
                    state:{
                        id:s.assignworkid
                    }
                }}
            >
                <div
                    className="work-list"
                    key={v}
                >
                    <span className="lv">{s.priority}</span>
                    <div className={`state ${state}`}>
                        <div></div>
                        <p>{state}</p>
                    </div>
                    <div className="list-top">
                        <div className="introduction">
                            <p className="title">{s.wono}</p>
                            <p className="list-color1">Assigned to: GROUP {s.team}</p>
                        </div>
                    </div>
                    <div className="list-bottom">
                        <Flex
                            justify="between"
                        >
                            <FlexItem>
                                <div className="list-info">
                                    <p className="list-color2">PlanDate</p>
                                    <p>{s.plandate}</p>
                                    <span
                                        style={{
                                            width:'1px',
                                            top:'5px'
                                        }}
                                    ></span>
                                </div>
                            </FlexItem>
                            <FlexItem>
                                <div className="list-info">
                                    <p className="list-color2">Acreg</p>
                                    <p>{s.acreg}</p>
                                    <span
                                        style={{
                                            width:'1px',
                                            top:'5px'
                                        }}
                                    ></span>
                                </div>
                            </FlexItem>
                            <FlexItem
                                style={{flex:1.2}}
                            >
                                <div className="list-info">
                                    <p className="list-color2">TaskNum</p>
                                    <p>{s.tasknum}</p>
                                    <span
                                        style={{
                                            width:'1px',
                                            top:'5px'
                                        }}
                                    ></span>
                                </div>
                            </FlexItem>
                        </Flex>
                    </div>
                </div>
            </Link>
        )
    }

    render(){
        const {nums,refreshing,isLoading,dataSource,hasMore,condition,rollingState} = this.state;
        return (
            <div>
                {
                    !dataSource?<ActivityIndicator />:
                        <ListView
                            ref="lv"
                            dataSource={dataSource}
                            renderRow={(s,v)=> this.rows(s,v,condition)}
                            initialListSize={nums}
                            pageSize={nums}
                            scrollRenderAheadDistance={200}
                            scrollEventThrottle={20}
                            onScroll={this.onScroll}
                            scrollerOptions={{ scrollbars: false }}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                icon={this.renderCustomIcon()}
                                loading={this.renderCustomLoading()}
                            />}

                            //onEndReached = {!hasMore?this.onEndReached:null}
                            onEndReached = {!hasMore && !rollingState?this.onEndReached:null}
                            // 当onEndReachedThreshold大于1时，的确进入页面就触发了，如果设置0~1则是按照正常的逻辑触发。
                            onEndReachedThreshold = {0}
                            renderFooter={()=> (
                                dataSource._cachedRowCount>0?
                                    (
                                        dataSource._cachedRowCount<10?
                                            null:
                                            <div style={{textAlign:'center'}}>
                                                {hasMore?'Loaded':'Loading...'}
                                            </div>
                                    )
                                    :
                                    <div className="noData">
                                        No Data
                                    </div>
                            )}
                        />
                }
            </div>
        )
    }
}

function reduxState(state){
    return {
        assigend:state.AdminWorksheetList
    }
}

Assigned = connect(reduxState)(Assigned);
export default Assigned;