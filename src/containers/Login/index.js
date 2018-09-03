import './index.css';

import React,{ Component } from 'react';
import { Toast,Button } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm} from 'rc-form';
import { connect } from 'react-redux';

import Native from '../../utils/Native';
import Api from '../../api/request';
import { reset } from '../../actions/reset';
import { currentAnimate } from '../../actions/currentAnimate';

import Content from '../../components/Content';


let first = null;
function onbackQuit () {
    if (!first) {
        first = new Date().getTime();
        plus.nativeUI.toast('Press exit application again',{duration:"1000"});
        setTimeout(function() {
            first = null;
        }, 1000);
    } else {
        if (new Date().getTime() - first < 1000) {
            plus.runtime.quit();
        }
    }
};

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            disabled:false
        };
        this.CID = '';
		this.obj = localStorage.LOGINMATION?
            eval('('+localStorage.LOGINMATION+')'):
            {
				userAccount:'',
				userPwd:''
            };
    };

    componentDidMount(){
	    let _this = this;
	    function plusReady(){
		    _this.setState({
			    disabled:false
		    });
		    _this.CID = plus.push.getClientInfo().clientid;
		    localStorage.CID = _this.CID;
		    Toast.hide();
		    plus.key.removeEventListener("backbutton",_this.onBack);
		    plus.key.addEventListener("backbutton",onbackQuit);
	    };

	    if ( window.plus ) {
		    plusReady();
	    } else {
		    document.addEventListener("plusready",plusReady,false);
	    }
    };

    componentWillMount(){

    }

    componentWillUnmount(){
		Toast.hide();
		let _this = this;
        //backbutton = this.props;
        function plusReadys(){
            plus.key.removeEventListener("backbutton",onbackQuit);
            plus.key.addEventListener("backbutton",_this.onBack);
        }
        if(window.plus){
            plusReadys();
        }else{
            document.addEventListener("plusready",plusReadys,false);
        }
    };

	onBack = _ => {
		this.props.dispatch(currentAnimate('right'));
		this.props.history.goBack();
	};

    submit = _ => {
        this.props.form.validateFields((error, value) => {

			value.userAccount= value.userAccount.toUpperCase();

            if(!error) {
				Native.showWaiting();

                this.setState({
                    disabled:true
                });

                value.cid = this.CID;

                Api.post('login',value)
                    .then(res => {
                        //console.log(value);
						Native.closeWaiting();
                        if(res.errorCode == 0) {
                            let data = res.data;
                            let HTTP = localStorage.HTTP;
                            localStorage.clear();
	                        localStorage.HTTP = HTTP;
                            localStorage.identity =
	                            (
		                            data.loginUserInfo.roles == '1'
		                            || data.loginUserInfo.roles == '19'
		                            || data.loginUserInfo.roles == '22'
		                            || data.loginUserInfo.roles == '23'
		                            || data.loginUserInfo.roles == '261'
	                            )
									?
									'1':'0';
                            localStorage.userId = data.loginUserInfo.id;    //  登出ID
                            localStorage.token = data.accessTokenInfo.accessToken;   //  token
                            localStorage.userAccount = data.loginUserInfo.login_name;
							localStorage.UserAvatar = data.loginUserInfo.photo || '';

							/*获取app信息*/
							if (window.plus) {
								localStorage.Version =  plus.runtime.version;
								localStorage.CID = plus.push.getClientInfo().clientid;
							}
							/**/

							if (this.obj.userAccount != '') {
								this.obj.userAccount == value.userAccount?null:
									this.props.dispatch(reset());
							};

                            localStorage.LOGINMATION = JSON.stringify(value);
                            this.props.history.replace('/');
                        } else {
                            Toast.info(res.errorMsg?res.errorMsg:'Error',2);
                            this.setState({
                                disabled:false
                            });
                        }
                    })
            }
        });
    };

    render(){
        const { getFieldProps } = this.props.form;
        const {disabled} = this.state;
        return (
            <Content
                style={{padding:'0'}}
                className="login"
            >
                <div className="logo">

                </div>
	            <div
		            className="modify-http"
	                style={{
	                	position:'fixed',
		                top:0,
	                	right:0,
		                width:'50px',
		                height:'50px'
	                }}
	            >
		            <Link
			            style={{
			            	display:'block',
				            width:'100%',
				            height:'100%'
			            }}
		                to={{
		                	pathname:'/modify_http'
		                }}
		            />

	            </div>
                <div className="login-input">
                    <from className="submit">
                        <div className="group-input">
                            <div className="icon icon-user"></div>
	                        <input type="text" placeholder="UserName" {...getFieldProps('userAccount',{
		                        initialValue:this.obj.userAccount,
		                        rules: [{ required: true }],
		                        onChange(value){
		                        	//console.log(value.target.value.toUpperCase());
			                        value.target.value = value.target.value.toUpperCase()
		                        }
	                        })}/>
                        </div>
                        <div className="group-input">
                            <div className="icon icon-password"></div>
                            <input type="password" placeholder="Password" {...getFieldProps('userPwd',{
                                initialValue:this.obj.userPwd,
                                rules: [{ required: true}]
                            })}/>
                        </div>

                        <div className="group-button">
                            {/*<div className="button" onClick={this.submit}>*/}
                                {/*LOGIN*/}
                            {/*</div>*/}
                            <Button
                                className="button"
                                onClick={this.submit}
                                disabled={disabled}
                            >
                                Login
                            </Button>
                        </div>
                    </from>
                </div>

                {/*<p className="help">Forgot password?</p>*/}
            </Content>
        )
    }
}

Login = createForm()(Login);
Login = connect()(Login);
export default Login;