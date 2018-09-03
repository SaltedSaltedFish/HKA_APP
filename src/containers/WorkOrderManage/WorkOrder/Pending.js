import './Assigned.css';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import {  ListView } from 'antd-mobile';
import {connect} from 'react-redux';

import Api from '../../../api/request';
import { adminPending } from '../../../actions/workOrder';

import ListViewComponent from '../../../components/ListView';
import WorkListADMIN from '../../../components/WorkListADMIN';

const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

class Pending extends Component {
	constructor(props){
		super(props);
		/*
        * @param userFlag string 0代表普通用戶 1代表管理員
        * */
		let condition = {
			engineer:'0',
			tasknum:props.tasknum?props.tasknum:undefined,
			taskState:props.taskState?props.taskState:undefined,
			//userFlag:'1'
		};
		this.state = {
			dataSource:false,
			refreshing:false,
			isLoading:true,
			pageNow:2,
			taskState:'',
			hasMore:false,
			totalPageSize:0,
			rollingState:false,
			isUpdate:false,

			array:[],

			condition

		};

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.url = 'workorder/getWorkOrderList';
	};

    componentWillMount(){

    };

    componentWillUnmount(){
		this.props.dispatch(adminPending({
			...this.state
		}));

		this.setState = _ => {};
    };

	componentWillReceiveProps(props) {
		this.update(props);
	}

    componentDidMount(){
	    if(this.props.state){
		    this.setState({
			    ...this.props.state
		    });
		    return;
	    };

	    this.update(this.props);
    };

	update = props => {
		const { condition } = this.state;
		if ( props.assigndate ) {
			condition.tasknum = props.tasknum;
			condition.taskState = props.taskState;
			condition.acreg = props.acreg;
			condition.flightnum = props.flightnum;
			condition.assigndate = props.assigndate;
			condition.engineerUser = props.engineerUser;
		};
		condition.pageNow = 1;
		if ((condition.tasknum || condition.tasknum == '') && props.assigndate) {
			this.setState({
				dataSource:false
			});
		} else {
			this.state.dataSource = false;
		}
		return Api.get( this.url,condition )
			.then(res => {
				if(res.errorCode == 0) {
					let data = res.pageInfo.pageData;
					this.state.array = data;
					this.setState({
						dataSource:this.dataSource.cloneWithRows(data),
						totalPageSize:res.pageInfo.totalPageSize,
						hasMore:false,
						pageNow:2,
						condition
					})
				} else {
					this.setState({
						dataSource:this.dataSource.cloneWithRows([]),
						hasMore:false,
						condition
					})
				};
			})
	};

	//  下拉
	onRefresh = () => {
		this.setState({ refreshing: true });
		this.update(true)
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
	};

	onEndReached = () =>{
		let { isLoading,pageNow,hasMore,totalPageSize,condition } = this.state;

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

    rows(s,v){
        return (
            <Link
                to={{
                    pathname: '/details_pending',
                    search: '?id='+ s.assignworkid,
                    state:{
                        id:s.assignworkid
                    }
                }}
            >
				<WorkListADMIN key={v} data={s} pending={true}/>
            </Link>
        )
    }

    render(){
		const {refreshing,dataSource,hasMore,rollingState} = this.state;
		return (
            <div style={{
				padding:'0 .3rem'
			}}>
                <ListViewComponent
                    dataSource={dataSource}
                    hasMore={hasMore}
                    rollingState={rollingState}
                    rows={(s,v)=> this.rows(s,v)}
                    refreshing={refreshing}
                    onScroll={this.onScroll}
                    onRefresh={this.onRefresh}
                    onEndReached = {this.onEndReached}
                />
            </div>
		)
    }
}

Pending = connect(state => {return {
	state:state.AdminWorksheetList.pending
}})(Pending);
export default Pending;