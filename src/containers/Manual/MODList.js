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
import {manualMOD} from "../../actions/manual";
const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;
const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

// let type = '',array = [],condition = {},typeBoolean,SBORMOD,Implementation;
// let url = `mod/mod/list`;

class ManualMODList extends Component {
    constructor(props){
        super(props);
		let DATA = props.reduxData?props.reduxData:null;
	    let cache = props.location.state?props.location.state.cache:false;
	    let show = !cache;
        this.state = {
			modalType:!show,
			modalCat:false,
			valueType:'A320',
			valueCat:'A',
			isRequest:true,
			upListView:true,
			condition:{},
			DATA,
	        show,
	        cache,
        };

		this.url = `mod/mod/list`;
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
	actions = (obj) => {
		this.props.dispatch(manualMOD({...obj}));
	};

	rows = (s,v) => {
        return (
            <Link
                to={{
					pathname:'/moddetails',
					state:{
						s:s
					}
				}}
            >
            <div key={v} className="list">
                <div className="list-top">
	                MOD:{s.mod}
	                &nbsp;&nbsp;
                    ATA:{s.ata}
	                &nbsp;&nbsp;
	                Acreg:{s.acreg}
	                <span>{s.actype}</span>
                </div>
                <p className="list-describe">
                    {s.title}
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
			upListView:false
        });
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {

			if (!error) {
				let condition = {};

				if ( value.acreg != '') {
					value.acreg = value.acreg.toUpperCase();
				};

				if ( value.actype != '') {
					value.actype = value.actype.toUpperCase();
				};

				condition = {...value};
				this.setState({
					modalType:false,
					condition,
					upListView:true,
					show:true,
				});
			};
        });
    };

    render(){
        const {
			modalType,upListView,condition,DATA,show,cache
        } = this.state;
        const { getFieldProps } = this.props.form;
        return (
            <Content
                style={{paddingBottom:0}}
            >
				<Header
					title="MOD"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>
                {/*<div className="manual-details newView">*/}
                    {/*<div className="manualSelect-list">*/}
						{/*<ListViewTest*/}
							{/*data={DATA}*/}
							{/*key={`MODVIEW`}*/}
							{/*rows={ this.rows }*/}
							{/*url={ this.url }*/}
							{/*update={ upListView }*/}
							{/*condition={ condition }*/}
							{/*cache={this.props.location.state}*/}
							{/*action={this.reduxAction}*/}
							{/*method={`post`}*/}
						{/*/>*/}
                    {/*</div>*/}
                {/*</div>*/}

	            {
		            show?
			            <div className="manual-details newView">
				            <div className="manualSelect-list">
					            <ListViewTest
						            data={DATA}
						            rows={ this.rows }
						            url={ this.url }
						            update={ upListView }
						            condition={ condition }
						            cache={this.props.location.state}
						            action={this.actions}
						            method={`post`}
					            />
				            </div>
			            </div>
			            :<div className="noData hasPadding">Please enter the criteria</div>
	            }

                <Modal
	                prefixCls={`criteria-warp am-modal`}
                    visible={modalType}
                    onClose={this.modalTypeCancel}
					transparent
					style={{width:'90%'}}
					//title={`Criteria`}
                >
                    <div className="from-input">
                        <from className="submit">

	                        <label className="group-input">
		                        <span>Actype</span>
		                        <input className={`uppercase`} type="text" {...getFieldProps('actype',{
			                        initialValue:''
		                        })}/>
	                        </label>

	                        <label className="group-input">
		                        <span>Acreg</span>
		                        <input className={`uppercase`} type="text" {...getFieldProps('acreg',{
			                        initialValue:''
		                        })}/>
	                        </label>

	                        <label className="group-input">
		                        <span>ATA</span>
		                        <input type="text" {...getFieldProps('ata',{
			                        initialValue:''
		                        })}/>
	                        </label>

                            <label className="group-input">
                                <span>MOD No.</span>
                                <input type="text" {...getFieldProps('mod',{
                                    initialValue:''
                                })}/>
                            </label>

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

ManualMODList = createForm()(ManualMODList);
ManualMODList = connect(state => {return {
	reduxData:state.ManualAMM.mod
}})(ManualMODList);
export default ManualMODList;