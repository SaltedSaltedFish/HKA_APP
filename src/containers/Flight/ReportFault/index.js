import './index.less';

import React,{Component} from 'react';
import {Modal,ImagePicker,Carousel,
	TextareaItem,ActivityIndicator,List,Radio
} from 'antd-mobile';
import {createForm } from 'rc-form';

import TimeConversion from '../../../utils/TimeConversion';
import Native from '../../../utils/Native';
import Api from '../../../api/request';
import UploadPictures from '../../../utils/UploadPictures';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import DatePickerChildren from '../../../components/DatePickerChildren';
import { TimeCHOICE } from '../../../components/TimeChoice';

let name = 0;
//  默认值
class ReportFault extends Component {
    constructor(props){
        super(props);
        let data = props.location.search.replace('?','').split('&');
        let condition = {
	        aclogid:data[0],
	        tlbid:data[2],
	        acreg:data[1],
	        sign:data[3] == 'null'?'':data[3]
        };

        this.state = {
            files:[],
            modalVisible:false,
            data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
	        condition,

	        isPost:false,
	        pirValue:{
            	value:'N'
	        },
	        pirModal:false,
	        //  只能輸入一個值
	        Raised:false,
	        Cleared:false,

	        utcdate:TimeConversion.TIME(TimeConversion.date()) //  時間
        };

        this.url = 'acflight/flight/report';

        this.inputArray = [
	        {
	        	label:'MEL/CDL REF',
		        name:'melcdlref'
	        },{
		        label:'MEL/CDL CAT',
		        name:'melcdlcat'
	        },{
		        label:'TIME LIMIT',
		        name:'timelimit'
	        },{
		        label:'AUTH',
		        name:'auth'
	        }
        ];

	    this.pirData = [
		    {
			    value:'Y'
		    },{
			    value:'N'
		    }
	    ];
    };

    componentWillMount(){

    };

    componentWillUnmount(){
    	if (window.plus) {
		    plus.uploader.clear();
	    }
    }

    //  时间变化
    dateChange = _ => {
        const date = _._d;
        let nowDate = TimeConversion.TIME(date);
        this.setState({ dpValue: _ ,nowDate:nowDate});
    };

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
            	const { condition } = this.state;
	            let { files } = this.state;
            	value.tlbid = condition.tlbid;
            	value.sign = condition.sign;
            	value.taken_ata = value.ata;
            	value.utcdate = this.state.utcdate;

            	this.setState({
		            isPost:true
	            });
                let sequence = 0;

                value.aclogid = this.state.condition.aclogid;

                if (window.plus) {
	                let task = plus.uploader.createUpload(httpRequest + this.url, {
		                method: "POST",
		                timeout:60
	                },(t, status) => {

		                if (status == 200) {
			                console.log("上传成功");
			                Native.alert('Success',()=> this.props.history.goBack());
		                } else {
			                Native.alert('error');
			                console.log("上传失败");
			                this.setState({
				                isPost:false
			                });
		                };

		                plus.uploader.clear();
	                });

	                Object.entries(value).map(s=>
		                task.addData(s[0],s[1])
                    );

	                task.addData("apptoken",localStorage.token);
	                task.addData("userAccount",localStorage.userAccount);

	                files.map((s,v)=>
		                task.addFile(s.src,{key:`photo`+(v+1)})
                    );

	                task.start();
                } else {
	                Api.post(this.url,value)
		                .then(res => {
			                Native.alert('Success',()=>this.props.history.goBack());
		                })
                }
            } else {
                Native.alert('Type is required');
            }
        });
    };

    onChange = (files, type) => {
        this.setState({
            files,
        });
    };

    onImageClick = (index,file) => {
        const { files } = this.state;
        if (window.plus) {
	        UploadPictures.Pictures(pa=>{
		        let path = '';
		        path = pa;
		        files.push({name:"name",age:'24',src:pa});
		        this.setState({
			        files
		        });
	        });
        } else {
	        name++;
	        files.push({name,age:'24',src:'1'});
	        this.setState({
		        files
	        });
        }

    };

	delete = (e,index) => {
	    //console.log('点击');
		e.preventDefault();
		const { files } = this.state;
		//console.log(files,files.length,index);
		files.splice(index,1);

		console.log(files,files.length);

		this.setState({
            files
        })
    };

    onClose = _ => {
      this.setState({
          modalVisible:false
      })
    };

    updateTime = (obj) => {
        console.log(obj);
        this.state.utcdate = obj.nowDate;
    };

    render(){
        const { getFieldProps } = this.props.form;
        const { files,modalVisible,condition,isPost,pirValue,ataValue } = this.state;
        return (
            <Content style={{
                paddingBottom:0
            }}>
                <Header title="REPORT FAULT"/>

	            <ActivityIndicator
		            toast
		            text="Loading..."
		            animating={ isPost }
	            />

                <div>
                    <div className="from-input">
                        <from className="submit">

	                        <div className="grouping">
		                        <p className="title">
			                        DEFECT
		                        </p>
		                        <label className="group-input">
			                        <span>ITEM</span>
			                        <input type="number" {...getFieldProps('itemno',{
				                        initialValue:'',
				                        rules: [{ required: true}]
			                        })}/>
		                        </label>

		                        <label
			                        className="group-input"
			                        onClick={() => this.setState({pirModal:true})}
		                        >
			                        <div className="icon icon-list-"></div>
			                        <span>PIREPENTRY</span>
			                        <input
				                        className={`disabled`}
				                        disabled
				                        style={{
					                        paddingLeft:'1.7rem'
				                        }}
				                        type="text" {...getFieldProps('pirepentry',{
				                        initialValue:pirValue.value,
				                        rules: [{ required: true}]
			                        })}/>
		                        </label>

		                        <label className="group-input">
			                        <span>ATA</span>
			                        <input
				                        type="number"
				                        onInput={ e => {
					                        if (e.target.value.length > 3) {
						                        e.target.value = e.target.value.slice(0,4);
						                        Modal.alert('ATA For 4 digit numbers');
					                        }}
				                        }
				                        onBlur={e => {
					                        e.target.value = e.target.value.slice(0,5);
				                        }
				                        }
				                        {...getFieldProps('ata',{
					                        initialValue:''
				                        })}/>
		                        </label>

		                        <label className="group-input">
			                        <span>RAISED BY</span>
			                        <input
				                        style={{
					                        paddingLeft:'1.7rem'
				                        }}
				                        {...getFieldProps('raisedby',{
					                        initialValue:''
				                        })}/>
		                        </label>

		                        <div className="group-input"
		                        >
			                        <p style={{paddingBottom:'0'}}>DEFECT DESCRIPTION</p>
			                        <TextareaItem
				                        rows={5}
				                        {...getFieldProps('defectdesc',{
					                        initialValue:''
				                        })}
			                        ></TextareaItem>

		                        </div>

	                        </div>

	                        <div className="grouping">
		                        <p className="title">
			                        ACTION TAKEN
		                        </p>

		                        <div className="group-input">
			                        <p style={{paddingBottom:'0'}}>DEFECT DESCRIPTION</p>
			                        <TextareaItem
				                        rows={5}
				                        {...getFieldProps('actiontaken',{
					                        initialValue:''
				                        })}
			                        ></TextareaItem>

		                        </div>

		                        {
			                        this.inputArray.map(s =>
				                        <label key={s.name} className="group-input">
					                        <span>{s.label}</span>
					                        <input
						                        style={{
							                        paddingLeft:'1.7rem'
						                        }}
						                        {...getFieldProps(s.name,{
							                        initialValue:''
						                        })}/>
				                        </label>
			                        )
		                        }

		                        <label className="group-input">
			                        <span>Raised ADD No.</span>
			                        <input
				                        className={`disabled`}
				                        disabled={this.state.Raised}
				                        onBlur={e => {
					                        if (e.target.value != '') {
						                        this.setState({
							                        Cleared:true
						                        })
					                        } else {
						                        this.setState({
							                        Cleared:false
						                        })
					                        }
				                        }
				                        }
				                        style={{
					                        paddingLeft:'1.7rem'
				                        }}
				                        {...getFieldProps('raisedadd',{
					                        initialValue:''
				                        })}/>
		                        </label>

		                        <label className="group-input">
			                        <span>Cleared ADD No.</span>
			                        <input
				                        className={`disabled`}
				                        disabled={this.state.Cleared}
				                        onBlur={e => {
					                        if (e.target.value != '') {
						                        this.setState({
							                        Raised:true
						                        })
					                        } else {
						                        this.setState({
							                        Raised:false
						                        })
					                        }
				                        }
				                        }
				                        style={{
					                        paddingLeft:'1.7rem'
				                        }}
				                        {...getFieldProps('clearedadd',{
					                        initialValue:''
				                        })}/>
		                        </label>

		                        <label className="group-input">
			                        <span>POSITION</span>
			                        <input
				                        {...getFieldProps('position',{
					                        initialValue:''
				                        })}/>
		                        </label>


		                        <label className="group-input">
			                        <span>UTC</span>
			                        <TimeCHOICE fn={ this.updateTime} />
		                        </label>

	                        </div>

	                        <div className="grouping">
		                        <div className="group-input"
		                             style={{
			                             //borderRadius: '0 0 .1rem .1rem',
			                             //borderTop: 0,
			                             padding: 0
		                             }}>
			                        <div className="uploadPictures">
				                        <ul>
					                        {
						                        files.map((s,v)=>
							                        <li
								                        key={v}
							                        >
                                                    <span
	                                                    className="icon icon-listDelete"
	                                                    onClick={ (e) => this.delete(e,v)}
                                                    >

                                                    </span>
								                        <img src={s.src} alt={s.name}/>
							                        </li>
						                        )
					                        }
					                        <li
						                        className="add-Photo"
						                        onClick={this.onImageClick}
					                        >
                                            <span className="icon icon-photo">

                                            </span>
						                        <p>PHOTOS</p>
					                        </li>
				                        </ul>
			                        </div>
		                        </div>
	                        </div>

                            <div
	                            className="group-button"
	                            style={{
	                            	marginBottom:'.4rem'
	                            }}
                            >
                                <div className="button" onClick={this.submit}>
                                    Submit
                                </div>
                            </div>
                        </from>
                    </div>
                </div>

                <Modal
                    transparent
                    visible={modalVisible}
                    onClose={this.onClose}
                    style={{width:'7rem'}}
                >
                    <Carousel
                        className="my-carousel"
                    >
                        {
                            files.map((ii,v) =>
                                <img
                                    key={v}
                                    src={ii.url}
                                />
                            )
                        }
                    </Carousel>
                </Modal>

	            <Modal
		            visible={ this.state.pirModal }
		            transparent
		            onClose={ () => this.setState({pirModal:false})}
		            className="modalSelect"
	            >
		            <List>
			            {
				            this.pirData.map(s =>
					            <Radio.RadioItem
						            key={ s.value }
						            checked={ pirValue.value === s.value }
						            onChange={() => this.setState({pirValue:s,pirModal:false})}
					            >
						            { s.value }
					            </Radio.RadioItem>
				            )
			            }
		            </List>
	            </Modal>
            </Content>
        )
    }
}
ReportFault = createForm()(ReportFault);
export default ReportFault;