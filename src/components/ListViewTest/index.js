/*下拉刷新容器*/

import React,{Component} from 'react';
import {RefreshControl, ListView,ActivityIndicator} from 'antd-mobile';
import PropTypes from 'prop-types';

import { is } from 'immutable';

import Api from '../../api/request';

class ListViewComponentTest extends Component {
    constructor(props){
        super(props);
	    let condition = props.condition?props.condition:{};
	    let num = props.num?props.num:10,state = {};

	    props.data?state = {...props.data}:state = {
		    dataSource:false,
		    num,
		    pageNow:2,
		    totalPageSize:0,
		    refreshing:false,
		    hasMore:false,
		    rollingState:false,
		    isLoading:true,
		    isRequest:true,
		    condition,
		    array:[],
	    };


	    /*
	    * @param { obj } dataSource 数据源
	    * @param { Number } num 每次展示的数据个数
	    * @param { Number } pageNow 请求的分页位置
	    * @param { Number } totalPageSize 总的页数
	    * @param { Boolean } refreshing 是否在刷新
	    * @param { Boolean } hasMore 是否可以继续加载更多
	    * @param { Boolean } rollingState 是否在加载更多
	    * */
	    this.state = {...state};

	    this.upState = false;
	    this.url = props.url;
	    this.dataSource = new ListView.DataSource({
		    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
	    });

	    this.method = props.method?props.method:'post';
    };

	componentWillMount(){

	};

	componentDidMount(){
		/*
		* @param { obj } this.props.data 是存储在redux中的数据
		* */
		let cache = false;

		if( this.props.cache) {
			cache = this.props.cache;
		} else {
			cache = false;
		};

		//console.log(this.props.data,!cache);
		if (this.props.data && !cache) {
			this.setState({
				...this.props.data
			});

			return;
		};

		this.update();
	};

	componentWillReceiveProps(nextProps){
		//console.log(nextProps);
	    if (nextProps.update) {
		    //this.state.condition = nextProps.condition;
		    this.setState({
			    condition: nextProps.condition,
			    dataSource:false
		    },() => this.update());
	    };
    };

	shouldComponentUpdate(nextProps, nextState){
		const thisProps = this.props || {}, thisState = this.state || {};
		if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			return true;
		}

		for (const key in nextProps) {
			if (!is(thisProps[key], nextProps[key])) {
				return true;
			}
		}

		for (const key in nextState) {
			if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
				return true;
			}
		}
		return false;
    };

	componentWillUnmount(){
	    /*
	    * @param { fn } this.props.action 触发redux的action 由父组件传递过来，存储对应的数据
	    * */
	    //console.log(this.state,this.props.action);
	    this.props.action?this.props.action(this.state):null;
	    this.setState = () => {};
    };

	update = _ => {
		let { array ,condition } = this.state;
		//console.log(condition);
		let pageNow = this.props.pageNow || 'pageNow';
		condition.pageNow = 1;
		return Api[this.method](this.url,condition)
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					array = res.pageInfo.pageData?res.pageInfo.pageData:res.data;

					this.state.dataSource = '';
					//_?_.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;

					this.setState({
						dataSource:this.dataSource.cloneWithRows(array),
						totalPageSize:res.pageInfo.totalPageSize,
						isRequest:false,
						hasMore:false,
						pageNow:2,
						array
					},()=>{
						this.upState = true;
                    });
				} else {
					this.setState({
						isRequest:false
					},()=>{
						this.upState = true;
					});
				}
			})
	};

	//  下拉
	onRefresh = (_) => {
		this.setState({ refreshing: true});
		this.update(_)
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
		let {isLoading,pageNow,hasMore,totalPageSize,array,condition} = this.state;

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

			Api[this.method](this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data;
						data = res.pageInfo.pageData?res.pageInfo.pageData:res.data;
						array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(array),
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

    render(){
        let {rows,onScroll,style, EndReached = true} = this.props;
	    let {dataSource,hasMore,rollingState,refreshing,num} = this.state;
	    //console.log(this.props);
        return (
            <div>
                {
                    !dataSource?<ActivityIndicator />:
                        <ListView
                            ref="lv"
                            style={{...style}}
                            dataSource={dataSource}
                            renderRow={(s,v) => rows(s,v)}
                            initialListSize={num}
                            pageSize={num}
                            scrollRenderAheadDistance={200}
                            scrollEventThrottle={20}
                            onScroll={onScroll}
                            scrollerOptions={{ scrollbars: false }}
                            refreshControl={<RefreshControl
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                icon={this.renderCustomIcon()}
                                loading={this.renderCustomLoading()}
                            />}

                            //onEndReached = {!hasMore?this.onEndReached:null}
                            onEndReached = {!hasMore && !rollingState && EndReached?this.onEndReached:null}
                            // 当onEndReachedThreshold大于1时，的确进入页面就触发了，如果设置0~1则是按照正常的逻辑触发。
                            onEndReachedThreshold = {0}
                            renderFooter={()=> (
								dataSource._cachedRowCount>0?
									(
										dataSource._cachedRowCount <10 || !EndReached?
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
};

ListViewComponentTest.PropTypes = {
	data:PropTypes.object,
	action:PropTypes.func,
	rows:PropTypes.func,
	update:PropTypes.bool,
	url:PropTypes.string
};

export default ListViewComponentTest;

/*其他*/
export class ListViewComponentEx1 extends Component {
	constructor(props){
		super(props);
		let condition = props.condition?props.condition:{};
		let num = props.num?props.num:10,state = {};

		//console.log(props);

		props.data?state = {...props.data}:state = {
			dataSource:false,
			num,
			pageNow:2,
			totalPageSize:0,
			refreshing:false,
			hasMore:false,
			rollingState:false,
			isLoading:true,
			isRequest:true,
			condition,
			array:[],
		};

		/*
		* @param { obj } dataSource 数据源
		* @param { Number } num 没次展示的数据个数
		* @param { Number } pageNow 请求的分页位置
		* @param { Number } totalPageSize 总的页数
		* @param { Boolean } refreshing 是否在刷新
		* @param { Boolean } hasMore 是否可以继续加载更多
		* @param { Boolean } rollingState 是否在加载更多
		* */
		this.state = {...state};

		//console.log(...state);

		this.upState = false;
		this.url = props.url;
		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.method = props.method?props.method:'post';
	};

	componentWillMount(){

	};

	componentDidMount(){
		/*
		* @param { obj } this.props.data 是存储在redux中的数据
		* */

		let listViewHeight = this.refs.viewContainer.offsetHeight;

		this.setState({
			listViewHeight
		});

		let cache = false;

		if( this.props.cache) {
			cache = this.props.cache;
		} else {
			cache = false;
		};

		//console.log(this.props.data,!cache);
		if (this.props.data && !cache) {
			this.setState({
				...this.props.data
			});

			return;
		};

		this.update();
	};

	componentWillReceiveProps(nextProps){
		//console.log(nextProps);
		if (nextProps.update) {
			//this.state.condition = nextProps.condition;
			this.setState({
				condition: nextProps.condition,
				dataSource:false
			},() => this.update());
		};
	};

	shouldComponentUpdate(nextProps, nextState){
		const thisProps = this.props || {}, thisState = this.state || {};
		if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
			Object.keys(thisState).length !== Object.keys(nextState).length) {
			return true;
		}

		for (const key in nextProps) {
			if (!is(thisProps[key], nextProps[key])) {
				return true;
			}
		}

		for (const key in nextState) {
			if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
				return true;
			}
		}
		return false;
	};

	componentWillUnmount(){
		/*
		* @param { fn } this.props.action 触发redux的action 由父组件传递过来，存储对应的数据
		* */
		//console.log(this.state,this.props.action);
		this.props.action?this.props.action(this.state):null;
		this.setState = () => {};
	};

	update = _ => {
		let { array ,condition } = this.state;
		//console.log(condition,this.state);
		let pageNow = this.props.pageNow || 'pageNow';
		condition.pageNow = 1;
		return Api[this.method](this.url,condition)
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					array = res.pageInfo.pageData?res.pageInfo.pageData:res.data;

					this.state.dataSource = '';
					//_?_.refs.lv.scrollTo(0,0):null;
					this.state.dataSource = false;

					this.setState({
						dataSource:this.dataSource.cloneWithRows(array),
						totalPageSize:res.pageInfo.totalPageSize,
						isRequest:false,
						hasMore:false,
						pageNow:2,
						array
					},()=>{
						this.upState = true;
					});
				} else {
					this.setState({
						isRequest:false
					},()=>{
						this.upState = true;
					});
				}
			})
	};

	//  下拉
	onRefresh = (_) => {
		this.setState({ refreshing: true});
		this.update(_)
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
		let {isLoading,pageNow,hasMore,totalPageSize,array,condition} = this.state;

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

			Api[this.method](this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data;
						data = res.pageInfo.pageData?res.pageInfo.pageData:res.data;
						array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(array),
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

	render(){
		let {rows,onScroll,style, EndReached = true} = this.props;
		let {dataSource,hasMore,rollingState,refreshing,num,listViewHeight} = this.state;
		//console.log(this.props);
		return (
			<div
				ref={`viewContainer`}
				style={{height:'100%'}}
			>
				{
					!dataSource?<ActivityIndicator />:
						<ListView
							ref="lv"
							style={{
								...style,
								height:listViewHeight + 'px',
							}}
							dataSource={dataSource}
							renderRow={(s,v) => rows(s,v)}
							initialListSize={num}
							pageSize={num}
							scrollRenderAheadDistance={200}
							scrollEventThrottle={20}
							onScroll={onScroll}
							scrollerOptions={{ scrollbars: false }}
							refreshControl={<RefreshControl
								refreshing={refreshing}
								onRefresh={this.onRefresh}
								icon={this.renderCustomIcon()}
								loading={this.renderCustomLoading()}
							/>}

							//onEndReached = {!hasMore?this.onEndReached:null}
							onEndReached = {!hasMore && !rollingState && EndReached?this.onEndReached:null}
							// 当onEndReachedThreshold大于1时，的确进入页面就触发了，如果设置0~1则是按照正常的逻辑触发。
							onEndReachedThreshold = {0}
							renderFooter={()=> (
								dataSource._cachedRowCount>0?
									(
										dataSource._cachedRowCount <10 || !EndReached?
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
};