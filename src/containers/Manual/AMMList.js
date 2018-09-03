import './details.less';

import React,{Component} from 'react';
import { connect} from 'react-redux';
import {Flex,Modal,Radio,List,ActivityIndicator,RefreshControl, ListView } from 'antd-mobile';
import {Link} from 'react-router-dom';
import { createForm } from 'rc-form';

import Header from '../../components/Header';
import Content from '../../components/Content';
// import ListViewComponent from '../../components/ListView';
import Api from '../../api/request';
import ListViewTest from '../../components/ListViewTest';
import {manualAMM} from "../../actions/manual";


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

class ManualAMMList extends Component {
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
	        modalType:!show,
        };
		this.url = `manual/amm/list`;
    }

    componentWillMount(){

    };

    componentDidMount(){

    }

    componentWillUnmount(){
        this.setState = _ => {};
    };

	reduxAction = (obj) => {
		this.props.dispatch(manualAMM({...obj}));
	};

	rows = (s,v) => {
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
                        ACTYPE：{s.actype}
	                    &nbsp;&nbsp;
	                    ATA:{s.ata}
                        <br/>
                        JOBCARD#：{s.jobcardno}
                        {/*<span>OPEN</span>*/}
                    </div>
                    <p className="list-describe">
                        {s.titleen}
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
    modalTypeCancel = e => {
        e.preventDefault();
        this.setState({
            modalType:false,
			upListView:false
        });
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {
			if (!error) {

				let values = Object.entries(value);
				let vLenght = values.length;
				let counter = vLenght;
				let condition = {};

				values.map( s => {
					if ( s[1] == 0) {
						counter --
					};
				});

				if ( counter == 0 ) {
					Modal.alert('Must fill in a criteria');
					return;
				};

				condition = {...value};
				this.setState({
					modalType:false,
					condition,
					show:true,
					upListView:true
				});
			}
        });
    };

    render(){
        const {
			modalType,upListView,condition,DATA,show
        } = this.state;

        const { getFieldProps } = this.props.form;

        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header
					title="AMM"
				>
					<div className="icon icon-filter" onClick={this.modalType}></div>
                </Header>
                <div className="manual-details newView">
	                {
		                show?
			                <div className="manualSelect-list">
				                <ListViewTest
					                data={DATA}
					                key={`AMMVIEW`}
					                rows={ this.rows }
					                url={ this.url }
					                update={ upListView }
					                condition={ condition }
					                cache={this.props.location.state}
					                action={this.reduxAction}
					                method={`post`}
				                />
			                </div>:<div className="noData">Please enter the criteria</div>
	                }
                </div>

                <Modal
	                prefixCls={`criteria-warp am-modal`}
                    visible={modalType}
                    popup = {false}
					transparent
                    animationType="slide-down"
                    onClose={this.modalTypeCancel}
					style={{width:'90%'}}
					//title={`Criteria`}
                >
                    <div className="from-input">
                        <from className="submit">
							<label className="group-input">
								<span>ATA</span>
								<input type="text" {...getFieldProps('ata',{
									initialValue:''
								})}/>
							</label>

                            <label className="group-input">
                                <span>ACTYPE</span>
                                <input type="text" {...getFieldProps('actype',{
                                    initialValue:''
                                })}/>
                            </label>
                            {/*<div className="group-input">*/}
                                {/*<span>IPCOWNER</span>*/}
                                {/*<input type="text" style={{paddingLeft: '1.5rem'}} {...getFieldProps('ipcowner',{*/}
                                    {/*initialValue:''*/}
                                {/*})}/>*/}
                            {/*</div>*/}
                            <label className="group-input">
                                <span>JOBCARDNO</span>
                                <input type="text" style={{paddingLeft: '1.6rem'}} {...getFieldProps('jobcardno',{
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

ManualAMMList = createForm()(ManualAMMList);
ManualAMMList = connect(state => ({reduxData:state.ManualAMM.amm}))(ManualAMMList);
export default ManualAMMList;