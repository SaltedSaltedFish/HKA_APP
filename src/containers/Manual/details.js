import './details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import { manualAMM,manualADD } from '../../actions/manual';
import {Flex,Modal,Radio,List,ActivityIndicator,RefreshControl, ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';

import Header from '../../components/Header';
import Content from '../../components/Content';
import Api from '../../api/request';


const modalData = [
    { value: 'A320', label: 'A320' },
    { value: 'A330', label: 'A330' },
    { value: 'A350', label: 'A350' },
];

const modalDataCAT = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'N/A', label: 'N/A' },
];

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;
const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

let type = '',array = [],condition = {},typeBoolean,SBORMOD,Implementation;

class ManualDetails extends Component {
    constructor(){
        super();
        this.state = {
            dataSource:false,
            nums:10,
            pageNow:2,
            totalPageSize:0,
            refreshing:false,
            hasMore:false,
            rollingState:false,
            isLoading:true,
            modalType:false,
            modalCat:false,
            valueType:'A320',
            valueCat:'A',
            isRequest:true
        }
    }

    componentWillMount(){

        type = this.props.location.search.replace('?','');
        typeBoolean = type == 'add';
        SBORMOD = type == 'sb' || type == 'mod';
        Implementation=type=="Implementation";
        //console.log(this.props.ManualAMM);
        // if(this.props.ManualAMM.state && type == 'amm'){
        //     const state = this.props.ManualAMM.state;
        //     this.setState({
        //         dataSource:state.dataSource,
        //         totalPageSize:state.totalPageSize,
        //         pageNow:state.pageNow,
        //         hasMore:state.hasMore,
        //         isLoading:state.isLoading,
        //         rollingState:state.rollingState,
        //         valueType:state.condition.valueType,
        //         valueCat:state.condition.valueCat
        //     });
        //     this.st = state.st;
        //     return;
        // }

        const {valueType,valueCat} = this.state;
        condition.valueType = valueType;
        condition.valueCat = valueCat;

        this.update();
    };

    componentDidMount(){

    }

    componentWillUnmount(){
        const {pageNow,dataSource,totalPageSize,hasMore,isLoading,rollingState} = this.state;

        if (type == 'amm') {
            this.props.dispatch(manualAMM({
                dataSource,
                totalPageSize,
                pageNow,
                hasMore,
                isLoading,
                rollingState,
                condition
            }));
        };
        if (type == 'add') {
            this.props.dispatch(manualADD({
                dataSource,
                totalPageSize,
                pageNow,
                hasMore,
                isLoading,
                rollingState,
                condition
            }));
        }

        this.setState = _ => {};
    };

    update = _ => {
        condition.pageNow = 1;
        let url = `manual/${type}/list`;
        let method = 'post';
        if (typeBoolean) {
            url = 'add/getAddList';
            method = 'get';
        }
        if (SBORMOD) {
            url = `mod/${type}/list`;
        }
        if(Implementation){
            url = '/software/software/list';
        }
        return Api[method](url,condition)
            .then(res => {
                //console.log(res);
                if (res.errorCode == 0) {
                    if (typeBoolean) {
                        array = res.data;
                    } else {
                        array = res.pageInfo.pageData;
                    }
                    this.state.dataSource = '';
                    this.refs.lv?this.refs.lv.scrollTo(0,0):null;
                    this.setState({
                        dataSource:dataSource.cloneWithRows(array),
                        totalPageSize:res.pageInfo.totalPageSize,
                        isRequest:false,
                        hasMore:false,
                        pageNow:2
                    })
                } else {
                    this.setState({
                        isRequest:false
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
            condition.pageNow = pageNow;

            let url = `manual/${type}/list`;
            let method = 'post';
            if (typeBoolean) {
                url = 'add/getAddList';
                method = 'get';
            };
            if (SBORMOD) {
                url = `mod/${type}/list`;
            };
            if(Implementation){
                url = '/software/software/list';
            }
            Api[method](url,condition)
                .then(res => {
                    if(res.errorCode == 0) {
                        let data;
                        if (typeBoolean) {
                            data = res.data;
                        } else {
                            data = res.pageInfo.pageData;
                        }
                        array.push(...data);
                        pageNow+=1;
                        this.setState({
                            dataSource:dataSource.cloneWithRows(array),
                            pageNow:pageNow,
                            isLoading:true,
                            rollingState:false
                        })
                    }
                });
        }
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

    rows(s,v){
        //console.log('使用');
        return (
            <Link
                to={{
                    pathname:'/manual_menu',
                    search:s.cardid
                }}
                key={v}
            >
                <div className="list">
                    <div className="list-top">
                        {s.actype}
                        {/*<span>OPEN</span>*/}
                    </div>
                    <p className="list-describe">
                        {s.titleen}
                    </p>
                </div>
            </Link>
        )
    };

    rowsADD(s,v){
        //console.log('使用ADD');
        return (
            <Link
                to={{
                    pathname:'/manual_menuADD',
                    search:s.addid
                }}
                key={v}
            >
                <div className="list">
                    <div className="list-top">
                        {s.acreg}
                        {/*<span>OPEN</span>*/}
                    </div>
                    <p className="list-describe">
                        {s.defectDesc}
                    </p>
                </div>
            </Link>
        )
    };
    rowsSB(s,v){
        //console.log('使用SB');
        return (
            <div className="list">
                <div className="list-top">
                    ata:{s.ata}
                    {/*<span>OPEN</span>*/}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    mod:{s.mod}
                </div>
                <p className="list-describe">
                    {s.title}
                </p>
            </div>
        )
    };
    rowsImplementation(s,v){
        //console.log('使用即在软件');
        return (
            <div className="list">
                <div className="list-top">
                    rn:{s.rn}
                    {/*<span>OPEN</span>*/}
                    &nbsp;&nbsp;
                    acreg:{s.acreg}
                    &nbsp;&nbsp;
                    ata:{s.ata}
                    &nbsp;&nbsp;
                    softpn:{s.softpn}

                    &nbsp;&nbsp;
                    <p>hardware:{s.hardware}</p>

                </div>
                <p className="list-describe">
                    <p>hardpn:{s.hardpn}</p>

                    <p>software:{s.software}</p>
                </p>
            </div>
        )
    };
    onChange = (valueType) => {
        condition.valueType = valueType;
        this.setState({
            valueType,
            modalType:false
        });
        this.update();
    };

    onChange2 = (valueCat) => {
        condition.valueCat = valueCat;
        this.setState({
            valueCat,
            modalCat:false
        });
        this.update();
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

    modalCat = _ => {
        this.setState({
            modalCat:true
        });
    };

    modalCatCancel = _ => {
        //e.preventDefault();
        this.setState({
            modalCat:false
        });
    };

    render(){
        const {
            modalCat,modalType,valueCat,valueType,isRequest,dataSource,nums,
            rollingState,hasMore,refreshing
        } = this.state;

        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="AMM"/>
                <div className="manual-select">
                    <Flex className="mation-bottom">
                        <FlexItem onClick={this.modalType}>
                            <div className="mation-list">
                                <div className="icon icon-list-"></div>
                                <p>{valueType}</p>
                            </div>
                        </FlexItem>
                        <FlexItem onClick={this.modalCat}>
                            <div className="mation-list">
                                <div className="icon icon-list-"></div>
                                <p>{valueCat}</p>
                            </div>
                        </FlexItem>
                    </Flex>
                </div>
                <div className="manual-details">
                    {
                        !dataSource?<ActivityIndicator />:
                            <div className="manualSelect-list">
                                <ListView
                                    ref="lv"
                                    dataSource={dataSource}
                                    renderRow={typeBoolean?(s,v)=> this.rowsADD(s,v):(SBORMOD?(s,v)=>this.rowsSB(s,v):(Implementation?(s,v)=>this.rowsImplementation(s,v):(s,v)=> this.rows(s,v)))}
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
                            </div>
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
                            modalData.map(s =>
                                <RadioItem key={`type${s.value}`} checked={valueType === s.value} onChange={() => this.onChange(s.value)}>
                                    {s.label}
                                </RadioItem>
                            )
                        }
                    </List>
                </Modal>

                <Modal
                    visible={modalCat}
                    transparent
                    onClose={this.modalCatCancel}
                    className="modalSelect"
                >
                    <List>
                        {
                            modalDataCAT.map(s =>
                                <RadioItem key={`cat${s.value}`} checked={valueCat === s.value} onChange={() => this.onChange2(s.value)}>
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

function reduxState (state) {
    return {
        ManualAMM:state.ManualAMM
    }
};

ManualDetails = connect(reduxState)(ManualDetails);
export default ManualDetails;