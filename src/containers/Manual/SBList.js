import './details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Modal } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../components/Header';
import Content from '../../components/Content';
import ListViewTest from '../../components/ListViewTest';
import {manualSB} from "../../actions/manual";

class ManualSBList extends Component {
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

		this.url = `mod/sb/list`;
    }

    componentWillMount(){

    };

    componentDidMount(){

    };

	actions = (obj) => {
		this.props.dispatch(manualSB({...obj}));
	};

    componentWillUnmount(){
        this.setState = _ => {};
    };

	rows = (s,v) => {
        return (
            <Link
                to={{
					pathname:'/sbdetails',
					state:{
					    s:s
                    }
				}}
            >
            <div key={v} className="list">
                <div className="list-top">
                    SB NO:{s.sbno}
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
					show:true
				});
			}
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
					title="SB"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
				</Header>

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
                    popup = {false}
                    animationType="slide-down"
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
                                <span>SB No.</span>
                                <input type="text" {...getFieldProps('sbno',{
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

function reduxState (state) {
    return {
		reduxData:state.ManualAMM.sb
    }
};

ManualSBList = createForm()(ManualSBList);
ManualSBList = connect(reduxState)(ManualSBList);
export default ManualSBList;