import './details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Flex,Modal,Radio,List,ActivityIndicator,RefreshControl, ListView } from 'antd-mobile';
import { createForm } from 'rc-form';
import {Link} from 'react-router-dom';

import Header from '../../components/Header';
import Content from '../../components/Content';
// import ListViewComponent from '../../components/ListView';
import ListViewTest from '../../components/ListViewTest';
import Api from '../../api/request';
import {manualDAM} from "../../actions/manual";

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;
const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

// let type = '',array = [],condition = {},typeBoolean,SBORMOD,Implementation;
// let url = 'damage/damage/list';
class ManualDAMList extends Component {
    constructor(props){
        super(props);
		let DATA = props.reduxData?props.reduxData:null;
        this.state = {
            // dataSource:false,
            // nums:10,
            // pageNow:2,
            // totalPageSize:0,
            // refreshing:false,
            // hasMore:false,
            // rollingState:false,
            // isLoading:true,
            // modalType:false,
            // modalCat:false,
            // valueType:'A320',
            // valueCat:'A',
            // isRequest:true
			modalType:false,
			modalCat:false,
			valueType:'A320',
			valueCat:'A',
			isRequest:true,
			upListView:true,
			condition:{},
			DATA,
        }
		this.url = 'damage/damage/list';
    }

    componentWillMount(){

        // type = this.props.location.search.replace('?','');
        // this.update();
    };

    componentDidMount(){

    }

    componentWillUnmount(){
        // condition = {};
        this.setState = _ => {};
    };
	reduxAction = (obj) => {
		this.props.dispatch(manualDAM({...obj}));
	};
    // update = _ => {
    //     condition.pageNow = 1;
    //     return Api.post(url,condition)
    //         .then(res => {
    //             //console.log(res);
    //             if (res.errorCode == 0) {
    //                 if (typeBoolean) {
    //                     array = res.data;
    //                 } else {
    //                     array = res.pageInfo.pageData;
    //                 }
    //                 this.state.dataSource = '';
    //                 this.refs.lv?this.refs.lv.scrollTo(0,0):null;
    //                 this.setState({
    //                     dataSource:dataSource.cloneWithRows(array),
    //                     totalPageSize:res.pageInfo.totalPageSize,
    //                     isRequest:false,
    //                     hasMore:false,
    //                     pageNow:2
    //                 })
    //             } else {
    //                 this.setState({
    //                     isRequest:false
    //                 })
    //             }
    //         })
    // };
	//
    // //  下拉
    // onRefresh = () => {
    //     this.setState({ refreshing: true });
    //     this.update()
    //         .then( _ => {
    //             this.setState({
    //                 refreshing: false
    //             });
    //         })
    // };
	//
    // onEndReached = () =>{
    //     let {isLoading,pageNow,hasMore,totalPageSize} = this.state;
	//
    //     if(totalPageSize < pageNow ){
    //         this.setState({
    //             hasMore:true
    //         });
	//
    //         return;
    //     }
	//
    //     this.setState({
    //         rollingState:true
    //     });
	//
    //     if(isLoading && !hasMore) {
    //         this.state.isLoading = false; //  改变但不刷新状态
    //         condition.pageNow = pageNow;
	//
    //         Api.post(url,condition)
    //             .then(res => {
    //                 if(res.errorCode == 0) {
    //                     let data;
    //                     if (typeBoolean) {
    //                         data = res.data;
    //                     } else {
    //                         data = res.pageInfo.pageData;
    //                     }
    //                     array.push(...data);
    //                     pageNow+=1;
    //                     this.setState({
    //                         dataSource:dataSource.cloneWithRows(array),
    //                         pageNow:pageNow,
    //                         isLoading:true,
    //                         rollingState:false
    //                     })
    //                 }
    //             });
    //     }
    // };

	rows = (s,v) => {
        return (
            <Link
                to={{
					pathname:'/damdetails',
					search:s.id
				}}
                key={v}
            >
            <div className="list">
                <div className="list-top">
                    {s.acreg}
                    <span>{s.type}</span>
                </div>
                <p className="list-describe">
                    {s.damagepos}
                </p>
            </div>
            </Link>
        )
    };

    modalType = _ => {
        this.setState({
            modalType:true,
			upListView:false
        });
    };
    modalTypeCancel = _ => {
        //e.preventDefault();
        this.setState({
            modalType:false,
			upListView:true
        });
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            // if (!error) {
            //     condition = {};
            //     condition = {...value};
            //     this.setState({
            //         modalType:false
            //     });
            //     this.update();
            // }
			if (!error) {
				let condition = {};
				condition = {...value};
				this.setState({
					modalType:false,
					condition,
					upListView:true
				});
			}
        });
    };

    render(){
        const {
            // modalCat,modalType,valueCat,valueType,isRequest,dataSource,nums,
            // rollingState,hasMore,refreshing
			modalType,upListView,condition,DATA
        } = this.state;
        const { getFieldProps } = this.props.form;
        return (
            <Content
                style={{paddingBottom:0}}
            >
				<Header
					title="DAMAGE"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>

                <div className="manual-details newView">


                            <div className="manualSelect-list">
								<ListViewTest
									data={DATA}
									key={`DAMVIEW`}
									rows={ this.rows }
									url={ this.url }
									update={ upListView }
									condition={ condition }
									cache={this.props.location.state}
									action={this.reduxAction}
									method={`post`}
								/>
                            </div>


                </div>

                <Modal
                    visible={modalType}
                    onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					title={`Criteria`}
                >
                    <div className="from-input">
                        <from className="submit">
							<div className="group-input">
								<span>ATA</span>
								<input type="text" {...getFieldProps('ata',{
									initialValue:''
								})}/>
							</div>

                            <div className="group-input">
                                <span>ACREG</span>
                                <input type="text" {...getFieldProps('acreg',{
                                    initialValue:''
                                })}/>
                            </div>

                            <div className="group-button">
                                <div className="button red" onClick={this.submit}>
                                    Submit
                                </div>
                            </div>
                        </from>
                    </div>
                </Modal>

            </Content>
        )
    }
}

ManualDAMList = createForm()(ManualDAMList);
ManualDAMList = connect(state => {return {
	reduxData:state.ManualAMM.dam
}})(ManualDAMList);
export default ManualDAMList;