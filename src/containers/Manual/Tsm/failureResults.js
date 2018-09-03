import  './index.css'

import React,{ Component } from 'react';
import { ListView } from 'antd-mobile';

import Api from '../../../api/request';

import ListViewComponent from '../../../components/ListView';

class FailureResults extends Component {
    constructor(props){
        super(props);
        this.state = {
			dataSource:false,
			refreshing:false,
			isLoading:true,
			pageNow:2,
			hasMore:false,
			totalPageSize:0,
			rollingState:false,

			condition:{
				taskId:props.taskId,
				type:3,
			},

			array:[]
        };
        this.url = 'tsm/findPossibleReason';

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
    };

    componentWillMount(){
		this.update();
	}

    rows(s,v){
        return (
               <div key={v}>
                    <div className="tsm">
						{s.TITLE}
                    </div>
              </div>

        )
    };

	update = _ => {
		let { array ,condition } = this.state;
		condition.pageNow = 1;
		return Api.get(this.url,condition)
			.then(res => {
				//console.log(res);
				if (res.errorCode == 0) {
					array = res.pageInfo.pageData;
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
					})
				} else {
					this.setState({
						isRequest:false
					})
				}
			})
	};
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

			Api.post(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data;
						data = res.pageInfo.pageData;
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


	render(){
        const { refreshing,dataSource,hasMore,rollingState } = this.state;
        return (
			<ListViewComponent
				style={{height:'84vh'}}
				dataSource={dataSource}
				hasMore={hasMore}
				rollingState={rollingState}
				rows={this.rows}
				refreshing={refreshing}
				onRefresh={this.onRefresh}
				onEndReached = {this.onEndReached}
			/>
        )
    }
}

export default FailureResults;