import './index.less';

import React,{Component} from 'react';
import { Modal,Radio,List,ActivityIndicator, DatePicker} from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Api from '../../api/request';
import TimeConversion from '../../utils/TimeConversion';

import LRUScanning from './scanning';
import { TimeCHOICE } from '../../components/TimeChoice';

const RadioItem = Radio.RadioItem;

class LRUComponent extends Component {
    constructor(props){
        super(props);
        let data = props.data;
        let lru = props.isLru,dpValue = TimeConversion.date();
        this.state = {

        	data,
	        lru,
	        dpValue,

        	visible:false,
	        isDelete:false,

	        Avail:{
		        value:'US',label:'US',
	        },
	        modalType:false,

	        cc:{
		        value:'RE',label:'RE'
	        },
	        ccModal:false,

	        array:[1],   //  录入的pn/sn数量
	        pnon:'',
	        snon:'',
	        bnon:'',
	        verificationnote:null,

	        isLoading:false,
        };

	    this.counter = 0;

	    this.AvailArray = [
		    {
		    	value:'US',label:'US',
		    },{
	    	    value:'SE',label:'SE'
		    }
	    ];

	    this.ccArray = [
		    {
			    value:'RE',label:'RE',
		    },{
			    value:'RP',label:'RP',
		    }
	    ];

	    this.inputArray = [
		    {
		    	label:'ATA',
			    value:'t_ata'
		    },{
		    	label:'ZONE',
			    value:'t_zone'
		    },{
	    	    label:'FIN',
			    value:'t_fin'
		    }
	    ];

	    this.ccDate = TimeConversion.date();    //  拆换时间

	    this.url = 'lru/save';
    };

    componentDidMount(){

    };

	componentWillUnmount(){

	};

	getPn = (part) => {
		console.log(part);
		this.setState({
			...part
		});
	};

	toggle = () => {
		this.setState({
			visible:!this.state.visible
		});
		this.state.verificationnote = null;
	};

	deleteToggle = () => {
		this.setState({
			isDelete:!this.state.isDelete
		});
	};

	onAdd = () => {
		let array = this.state.array;
		array.push({
			key:this.counter,
			value:this.counter
		});
		this.setState({
			array,
		});
		this.counter++;
	};

	onRemove  = (v) => {
		let array = this.state.array;
		array.splice(v, 1);
		this.setState({
			array,
		});
	};

	onSave = () => {
		this.props.form.validateFields((error,value)=> {
			this.setState({
				isLoading:true
			});
			if (!error) {
				const { data,lru } = this.state;
				value.assignworkid = data.assignworkid;
				value.woitemid = lru.woitemid;
				value.partid = lru.partid;
				value.partserid = lru.partserid;
				value.completed = lru.completed;
				value.removal = lru.removal;
				value.pn = lru.pn;
				value.sn = lru.sn;
				value.ccdate = this.ccDate;
				console.log(value);
				Api.post(this.url,value)
					.then(res => {
						console.log(res);
						let verificationnote = null;

						if ( res.errorCode == 0) {
							verificationnote = res.data.VERIFICATIONNOTE || '';
						};

						this.setState({
							verificationnote,
							isLoading:false
						})
					});
			};
		});
	};

	modalType = () => {
		this.setState({
			modalType:true
		});
	};

	modalTypeCancel = () => {
		this.setState({
			modalType:false
		})
	};

	onChange = (Avail) => {
		this.setState({
			Avail,
			modalType:false
		});
	};

	modalType1 = (e) => {
		e.preventDefault();
		this.setState({
			ccModal:true
		});
	};

	modalTypeCancel1 = () => {
		this.setState({
			ccModal:false
		})
	};

	onChange1 = (cc) => {
		this.setState({
			cc,
			ccModal:false
		});
	};

	updateTime = (obj) => {
		console.log(obj);
		this.ccDate = obj.nowDate;
	};

    render(){
    	const {
    		visible,array,isDelete,
		    Avail,modalType,lru,
		    pnon,snon,bnon,verificationnote,
		    isLoading,
		    cc,
    	} = this.state;
	    const { getFieldProps } = this.props.form;
    	console.log(lru);
        return (
	        <div className={`lru ${isDelete?'delete':''}`}>
		        <from className={`from-input`}>

			        <div className="group-input"
			             onClick={this.modalType}
			        >
				        <label>
					        <div className="icon icon-list-"></div>
					        <span>Avail</span>
					        <input
						        style={{
							        paddingLeft: '.8rem',
						        }}
						        disabled
						        type="text" {...getFieldProps('outavail',{
						        initialValue:Avail.value,
					        })}/>
				        </label>
			        </div>

			        <div className="group-input"
			             onClick={ (e) => this.modalType1(e) }
			        >
				        <label>
					        <div className="icon icon-list-"></div>
					        <span>CCTYPE</span>
					        <input
						        style={{
							        paddingLeft: '1.2rem',
						        }}
						        disabled
						        type="text" {...getFieldProps('cctype',{
						        initialValue:cc.value,
					        })}/>
				        </label>
			        </div>

			        <div className="group-input">
				        <label>
					        <div className="icon icon-list-"></div>
					        <span>CCDATE</span>
					        <TimeCHOICE fn={this.updateTime}/>
				        </label>
			        </div>

			        <div className="lruList">
				        <label className="lruLine">
					        <p className={`title`}>P/N:</p>
					        <p className={`content`}>
						        <input
							        disabled
							        type="text" value={lru.pn} />
					        </p>
				        </label>
				        <label className="lruLine">
					        <p className={`title`}>S/N:</p>
					        <p className={`content`}>
						        <input
							        disabled
							        type="text" value={lru.sn} />
					        </p>
				        </label>
			        </div>

			        {
				        this.inputArray.map(s=>
					        <div key={s.value} className="group-input disabled"
					        >
						        <label>
							        <span>{s.label}</span>
							        <input
								        style={{
									        paddingLeft: '.7rem'
								        }}
								        className="disabled"
								        disabled
								        type="text" {...getFieldProps(s.value,{
								        initialValue:lru[s.value] || '',
							        })}/>
						        </label>
					        </div>
				        )
			        }

			        <div className="group-input">
				        <p>Remark</p>
				        <textarea
					        cols="30"
					        rows="10"
					        maxLength={1000}
					        style={{
						        width:'100%'
					        }}
					        {...getFieldProps('removedesc')}
				        ></textarea>
			        </div>

			        {
				        cc.value == 'RP'?
					        array.map( (s,v)=>
						        <div key={v} className="lruList">
							        <div className="list-operation">
								        <div className="icon-listDelete"
								             //onClick={ () => this.onRemove(v) }
								        ></div>
							        </div>
							        <label className="lruLine">
								        <p className={`title`}>P/N ON:</p>
								        <p className={`content`}>
									        <input type="text"
									               name={`pn${v}`}
									               {...getFieldProps(`pnon`,{
										               initialValue:pnon
									               })}/>
								        </p>
							        </label>
							        <label className="lruLine">
								        <p className={`title`}>S/N ON:</p>
								        <p className={`content`}>
									        <input type="text"
									               name={`sn${v}`}
									               {...getFieldProps(`snon`,{
										               initialValue:snon
									               })}/>
								        </p>
							        </label>

							        <label className="lruLine">
								        <p className={`title`}>B/N ON:</p>
								        <p className={`content`}>
									        <input type="text"
									               name={`bn${v}`}
									               {...getFieldProps(`bnon`,{
										               initialValue:bnon
									               })}/>
								        </p>
							        </label>
						        </div>
				            ):null
			        }

			            {
				            verificationnote?
					            <div className={`text-prompt`}
					                 dangerouslySetInnerHTML={{__html:verificationnote}}
					            >

					            </div>:null
			            }
		        </from>
		        <div
			        className="lruButton"
		        >
			        <div
				        className="lruButton-item"
				        onClick={this.toggle}
				        //onClick={ this.onAdd }
			        >
				        <div className="icon icon-lruScanning"></div>
				        SCAN
			        </div>
			        <div
				        className="lruButton-item"
				        //onClick={this.deleteToggle}
				        onClick={this.onSave}
			        >
				        <div className="icon icon-lruSave"></div>
				        {/*<div className="icon icon-lruDelete"></div>*/}
				        SAVE
			        </div>
		        </div>

		        {
			        visible?
				        <div className="scaLru">
					        <LRUScanning fn={this.toggle} getPn={this.getPn} />
				        </div>:null
		        }

		        <ActivityIndicator
			        toast
			        text="Loading..."
			        animating={ isLoading }
		        />


		        <Modal
			        visible={modalType}
			        transparent
			        onClose={this.modalTypeCancel}
			        className="modalSelect"
		        >
			        <List>
				        {
					        this.AvailArray.map(s =>
						        <RadioItem key={`type${s.value}`}
						                   checked={Avail.value === s.value}
						                   onChange={() => this.onChange(s)}
						        >
							        {s.label}
						        </RadioItem>
					        )
				        }
			        </List>
		        </Modal>

		        <Modal
			        visible={this.state.ccModal}
			        transparent
			        onClose={this.modalTypeCancel1}
			        className="modalSelect"
		        >
			        <List>
				        {
					        this.ccArray.map(s =>
						        <RadioItem key={`type${s.value}`}
						                   checked={this.state.cc.value === s.value}
						                   onChange={() => this.onChange1(s)}
						        >
							        {s.label}
						        </RadioItem>
					        )
				        }
			        </List>
		        </Modal>
	        </div>
        )
    }
};
LRUComponent = createForm()(LRUComponent);
export default LRUComponent;