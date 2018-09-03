/**
 * Created by hf on 2017/12/29/029.
 */
import './index.css';
import React,{Component} from 'react';
import { Switch,List } from 'antd-mobile';

import Api from '../../../api/request';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import Content from '../../../components/Content';
import { createForm } from 'rc-form';
import UploadPictures from "../../../utils/UploadPictures";
import Native from "../../../utils/Native";

class PeInModification extends Component {
    constructor(props){
        super(props);
	    let UserAvatar = localStorage.UserAvatar;
	    let checked = Boolean(localStorage.isLM);
        this.state = {
            condition:{},
			UserAvatar,
	        checked,
        };


        this.url = '';
    }



    componentDidMount(){

    };


    componentWillUnmount(){
    	console.log(this.state.checked);
    	if ( this.state.checked ) {
    		localStorage.isLM = 'true';
	    } else {
    		localStorage.removeItem('isLM');
	    }
    };

	information = _ => {
			_.preventDefault();
			UploadPictures.Pictures(pa=>{
				//console.log(pa);
				let path = '';
				path = pa;
				Native.showWaiting();

				let task = plus.uploader.createUpload(httpRequest+'user/photo', {
					method: "POST"
				},(t, status)=>{
					console.log(status);
					Native.closeWaiting();
					if (status == 200) {
						console.log("上传成功");
						Native.alert('success');
						//plus.storage.setItem('UserAvatar',path);
						this.setState({
							UserAvatar:path
						});
						localStorage.UserAvatar = path;
					} else {
						Native.alert('error');
						console.log("上传失败");
					};
					plus.uploader.clear();
				});
				task.addData("id",localStorage.userId);
				task.addData("apptoken",localStorage.token);
				task.addData("userAccount",localStorage.userAccount);
				task.addFile(path,{key:'photo'});
				task.start();
			});
	};

    submit = _ => {
        this.props.form.validateFields((error, value) => {

            if (!error) {
                let condition = {};
                condition = {...value};
                this.setState({
                    modalType:false,
                    condition
                },()=> Api.get(this.url,condition)
                    .then(res => {
                        if(res.errorCode == 0) {

                        }
                    }));
            }
        });
    };

    isLM = () => {
    	console.log(2);
	    this.setState({checked:!this.state.checked});
    };

    render(){
		let userAccount = localStorage.userAccount;
		const {  UserAvatar,checked } = this.state;
        const { getFieldProps } = this.props.form;
        return (
            <Content
                style={{
                    paddingBottom:0,
                }}
            >
                <Header title="Modification" />
                <div className="mation-bottom">

	                <div className="mation-list " style={{height:'1.6rem'}} onClick={this.information}>
	                    <div className= "pic">
		                    {
			                    UserAvatar == ''?
				                    <img
					                    src={require('../../../../static/images/287251719018053570.png')}
					                    alt=""
					                    // onLoad={this.SaveImg(UserAvatar)}
				                    />:
				                    <img
					                    src={ httpRequest + UserAvatar }
					                    alt=""
					                    // onLoad={this.SaveImg(UserAvatar)}
				                    />
		                    }
						</div>
	                    <div className="icon icon-list-" style={{top:'0.62rem'}}>
	                    </div>

	                    <div className="pein_myhead" >My Head</div>
	                </div>

	                <div className="mation-list">
	                    <div style={{float:'left'}}>My Name</div>
	                    <div className="pein_myname">{userAccount}</div>
	                </div>

	                <div className="mation-list">
		                <div style={{float:'left'}}>Version</div>
		                <div className="pein_myname">{localStorage.Version || ''}</div>
	                </div>

	                <div
		                className="mation-list"
		                style={{height:'auto'}}
	                >
		                <div>CID</div>
		                <div
			                style={{float:'none',padding:'0',wordBreak: 'break-word'}}
			                className="pein_myname"
		                >
			                {localStorage.CID || ''}
		                </div>
	                </div>

	                {/*<div*/}
		                {/*className="mation-list"*/}
		                {/*style={{height:'auto',overflow:'hidden'}}*/}
	                {/*>*/}
		                {/*<div style={{float:'left',lineHeight:'.6rem'}}>*/}
			                {/*{checked?'LM展示':'MCC展示'}*/}
		                {/*</div>*/}
		                {/*<div className="pein_myname">*/}
			                {/*<Switch*/}
				                {/*checked={checked}*/}
				                {/*onChange={this.isLM}*/}
			                {/*/>*/}
		                {/*</div>*/}
	                {/*</div>*/}

	                {/*<Link to="pwModification">*/}
		                {/*<div className="mation-list">*/}
			                {/*<div className="icon icon-list-">*/}
			                {/*</div>*/}
			                {/*<div >Modify Password</div>*/}
		                {/*</div>*/}
	                {/*</Link>*/}

                </div>
            </Content>
        )
    }
}

PeInModification = createForm()(PeInModification);
export default PeInModification;/**
 * Created by hf on 2017/12/29/029.
 */
