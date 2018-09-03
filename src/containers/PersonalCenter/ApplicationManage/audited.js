import './details.css';

import React,{ Component } from 'react';
import { Link } from 'react-router-dom';
import { ListView } from 'antd-mobile';

import Api from '../../../api/request';

import ListViewComponent from '../../../components/ListView';

class Audited extends Component {
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
				role:props.identity?'0':'1',
				status:'3',
				pageNow:'1'
			},

			array:[]
        };
        this.url = 'message/delay/list';

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});
    };

    componentWillMount(){
		this.update();
	}

    rows(s,v){
        return (
            <Link
                to={{
                    pathname: '/application_details',
					state:s,
					search:'?id='+s.fromassignworkid
                }}
				key={v}
            >
                <div className="application-list">
                    <span className="icon icon-delayed"></span>
                    <div className="application-info">
                        <p className="title">Delay</p>
                        <p>Proposer：{ s.createdby } </p>
                        <p>Application Time：{ s.createdwhen }</p>
                    </div>
                    <p className="describe">
						{s.delayreason}
                    </p>
                </div>
            </Link>
        )
    };

	update = () => {
		const { condition } = this.state;
		return Api.post(this.url,{...condition})
			.then(res => {
				let dataSource = this.dataSource.cloneWithRows(res.pageInfo.pageData);
				console.log(res);
				this.setState({
					dataSource,
					totalPageSize:res.pageInfo.totalPageSize,
					hasMore:false,
					pageNow:2
				})
			})
	};

	onRefresh = () => {
		this.setState({ refreshing: true });
		this.update()
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
		//this.refs.lv.scrollTo(0, 5400)
	};

	onEndReached = _ =>{
		let {isLoading,pageNow,hasMore,totalPageSize,condition} = this.state;

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
			condition.pageNow = pageNow;
			this.state.isLoading = false; //  改变但不刷新状态
			Api.post(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data = res.pageInfo.pageData;
						this.state.array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(this.state.array),
							pageNow:pageNow,
							isLoading:true,
							rollingState:false,
							condition
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

export default Audited;