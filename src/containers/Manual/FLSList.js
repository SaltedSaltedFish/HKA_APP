import './details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import { Modal,ActivityIndicator, ListView } from 'antd-mobile';
import { createForm } from 'rc-form';
import {Link} from 'react-router-dom';

import Header from '../../components/Header';
import Content from '../../components/Content';
// import ListViewComponent from '../../components/ListView';
import ListViewTest from '../../components/ListViewTest';
import Api from '../../api/request';
import {manualFLS} from "../../actions/manual";

const dataSource = new ListView.DataSource({
    rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
});

// let type = '',array = [],condition = {},typeBoolean,SBORMOD,Implementation;
// let url = `software/software/list`;

class ManualFLSList extends Component {
    constructor(props){
        super(props);
		let DATA = props.reduxData?props.reduxData:null;
	    let cache = props.location.state?props.location.state.cache:false;
	    let show = !cache;

        this.state = {
			modalCat:false,
			valueType:'A320',
			valueCat:'A',
			isRequest:true,
			upListView:true,
			condition:{},
			DATA,

	        cache,  //  回退不请求数据
	        show,
	        modalType:!show, //  筛选项
        };

		this.url = `software/software/list`;
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
		this.props.dispatch(manualFLS({...obj}));
	};

	rows = (s,v) => {
        return (
            <Link
                to={{
					pathname:'/flsdetails',
					// search:s.id
					state:{
						s:s
					}
				}}
            >
            <div key={v} className="list">
                <div className="list-top">
                    RN：{s.rn}
                    {/*<span>OPEN</span>*/}
                    &nbsp;&nbsp;
                    ACREG：{s.acreg}
                    &nbsp;&nbsp;
                    ATA：{s.ata}
                    <br/>
                    SOFTPN：{s.softpn}
                    &nbsp;&nbsp;
	                <p>FIN:{s.fin}</p>
                    <p>HARDWARE：{s.hardware}</p>

                </div>
                <div className="list-describe">
                    <p>HARDPN：{s.hardpn}</p>

                    <p>SOFTWARE：{s.software}</p>
                </div>
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
					title="FLS"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>

                {/*<div className="manual-details newView">*/}
                    {/*<div className="manualSelect-list">*/}
						{/*<ListViewTest*/}
							{/*data={DATA}*/}
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
                                <span>Hardware PN</span>
                                <input style={{paddingLeft:'1.5rem'}} type="text" {...getFieldProps('hardpn',{
                                    initialValue:''
                                })}/>
                            </label>

                            <label className="group-input">
                                <span>Soft PN</span>
                                <input type="text" {...getFieldProps('softpn',{
                                    initialValue:''
                                })}/>
                            </label>

	                        <label className="group-input">
		                        <span>Hardware Fin</span>
		                        <input style={{paddingLeft:'1.5rem'}} type="text" {...getFieldProps('fin',{
			                        initialValue:''
		                        })}/>
	                        </label>

                            {/*<div className="group-input">*/}
                                {/*<span>ATA</span>*/}
                                {/*<input type="text" {...getFieldProps('ata',{*/}
                                    {/*initialValue:''*/}
                                {/*})}/>*/}
                            {/*</div>*/}

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

function reduxState (state) {
    return {
		reduxData:state.ManualAMM.fls
    }
};
ManualFLSList = createForm()(ManualFLSList);
ManualFLSList = connect(reduxState)(ManualFLSList);
export default ManualFLSList;