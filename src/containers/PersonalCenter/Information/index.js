import './index.css';

import React,{Component} from 'react';
import {Flex} from 'antd-mobile';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router';
import {connect} from 'react-redux';

import Native from '../../../utils/Native';
import Api from '../../../api/request';
import Content from '../../../components/Content';
import UploadPictures from '../../../utils/UploadPictures';
import { reset } from '../../../actions/reset';

const FlexItem = Flex.Item;

class Information extends Component {
    constructor(props){
        super(props);
        let UserAvatar = localStorage.UserAvatar;
        this.state = {
            myApplication:'0',
			UserAvatar
        }
    };

    componentWillMount(){
        // Api.post('workorder/getDelayApplyInfoListCount',{username:localStorage.userAccount})
        //     .then(res =>
        //         this.setState({
        //             myApplication:res.data
        //         })
        //     )

    };

    componentWillUnmount(){
        this.setState = _ => {};
    };

	// // 保存在本地
	// SaveImg = (path) => {
	// 	if (window.plus) {
	// 		let localPath = plus.io.convertAbsoluteFileSystem(path);
	// 		//console.log(localPath);
	// 		plus.storage.setItem(localStorage.userAccount,localPath);
	// 	};
	// };

	// information = _ => {
	// 	_.preventDefault();
	// 	UploadPictures.Pictures(pa=>{
	// 		//console.log(pa);
	// 		let path = '';
	// 		path = pa;
	// 		Native.showWaiting();
	// 		let task = plus.uploader.createUpload(httpRequest+'user/photo', {
	// 			method: "POST"
	// 		},(t, status)=>{
	// 			console.log(status);
	// 			Native.closeWaiting();
	// 			if (status == 200) {
	// 				console.log("上传成功");
	// 				Native.alert('success');
	// 				//plus.storage.setItem('UserAvatar',path);
	// 				this.setState({
	// 					UserAvatar:path
	// 				});
	// 				localStorage.UserAvatar = path;
	// 			} else {
	// 				Native.alert('error');
	// 				console.log("上传失败");
	// 			};
	// 			plus.uploader.clear();
	// 		});
	// 		task.addData("id",localStorage.userId);
	// 		task.addData("apptoken",localStorage.token);
	// 		task.addData("userAccount",localStorage.userAccount);
	// 		task.addFile(path,{key:'photo'});
	// 		task.start();
	// 	});
	// };

	to = () => {
		//window.location.href='#/peInModification';
		this.props.history.push('/peInModification')
	};

    loginOut = _ => {
		Native.showWaiting();
        Api.post('loginOut',{id:localStorage.userId})
            .then(res => {
				Native.closeWaiting();
                if(res.errorCode == 0) {
					sessionStorage.clear();
					this.props.dispatch(reset());	//	清除redux
                    this.props.history.replace('/login');
	                tabs = tabName;
                } else {
					Native.alert('Error');
				}
            })
    };

    render(){
        let identity = Boolean(Number(localStorage.identity));
        let userAccount = localStorage.userAccount;
        const { myApplication , UserAvatar } = this.state;
		//console.log(UserAvatar);
	    identity = false;
        return (
            <Content
                style={{paddingTop:0}}
            >
                <div className="mation-top">
                    <div className="portrait" onClick={this.to}>
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
                    <div className="name">{ userAccount }</div>

                    {
                        identity ?
                            <Flex
                                className="admin"
                            >
                                <FlexItem>
                                    <Link
                                        to={{
                                            pathname: '/personal_manage',
                                        }}
                                    >
                                        <div className="mation-list">
                                            <span className="icon icon-staff" style={{left:'48%'}}></span>
                                            <p>Shift</p>
                                        </div>
                                    </Link>
                                </FlexItem>

                                {/*<FlexItem>*/}
                                    {/*<Link*/}
                                        {/*to={{*/}
                                            {/*pathname: '/nrc',*/}
                                        {/*}}*/}
                                    {/*>*/}
                                        {/*<div className="mation-list">*/}
                                            {/*<span className="icon icon-task" style={{left:'45%'}}></span>*/}
                                            {/*<p>NRC</p>*/}
                                        {/*</div>*/}
                                    {/*</Link>*/}
                                {/*</FlexItem>*/}
                                {/*<FlexItem>*/}
                                    {/*<Link*/}
                                        {/*to={{*/}
                                            {/*pathname: '/application_manage',*/}
                                        {/*}}*/}
                                    {/*>*/}
                                        {/*<div className="mation-list">*/}
                                            {/*<span className="icon icon-requires"></span>*/}
                                            {/*<p>My Job</p>*/}
                                        {/*</div>*/}
                                    {/*</Link>*/}
                                {/*</FlexItem>*/}
                            </Flex>:null
                    }
                </div>

                <div className="mation-bottom">
                    {/*<Link*/}
                        {/*to={{*/}
                            {/*pathname: '/my_news',*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<div className="mation-list">*/}
                            {/*<div className="icon icon-list-">*/}

                            {/*</div>*/}
                            {/*<span className="icon icon-news"></span>*/}
                            {/*<p>Messages</p>*/}
                        {/*</div>*/}
                    {/*</Link>*/}

					{/*{我的申请*/}
						{/*identity?null:*/}
							{/*<Link*/}
								{/*to={{*/}
									{/*pathname: '/my_application',*/}
								{/*}}*/}
							{/*>*/}
								{/*<div className="mation-list">*/}
									{/*<div className="icon icon-list-">*/}
										{/*{*/}
											{/*myApplication > 0?*/}
												{/*<span className="mation-badge">{myApplication}</span>:null*/}
										{/*}*/}
									{/*</div>*/}
									{/*<span className="icon icon-application"></span>*/}
									{/*<p>My Application</p>*/}
								{/*</div>*/}
							{/*</Link>*/}
					{/*}*/}

                    <Link
                        to={{
                            pathname: '/hour_statistics',
                        }}
                    >
                        <div className="mation-list">
                            <div className="icon icon-list-"></div>
                            <span className="icon icon-hour"></span>
                            <p>Man Hour Statistics</p>
                        </div>
                    </Link>

                    {/*<Link*/}
                        {/*to={{*/}
							{/*pathname: '/admin_notice',*/}
							{/*state:{*/}
								{/*cache:true*/}
							{/*}*/}
						{/*}}*/}
                    {/*>*/}
                        {/*<div className="mation-list">*/}
                            {/*<div className="icon icon-list-"></div>*/}
                            {/*<span className="icon icon-notice"></span>*/}
                            {/*<p>Work Alarm</p>*/}
                        {/*</div>*/}
                    {/*</Link>*/}
                    {/*<div className="mation-list">*/}
                        {/*<div className="icon icon-list-"></div>*/}
                        {/*<span className="icon icon-hour"></span>*/}
                        {/*<p>Man Hour Statistics</p>*/}
                    {/*</div>*/}

                    {/*<div className="mation-list">*/}
                        {/*<div className="icon icon-list-"></div>*/}
                        {/*<span className="icon icon-password-info"></span>*/}
                        {/*<p>Modify Password</p>*/}
                    {/*</div>*/}

                </div>

                <div className="signOut" onClick={ this.loginOut }>
                    <p>Sign Out</p>
                </div>
            </Content>
        )
    }
}
Information = connect(state => {return {state}})(Information);
Information = withRouter(Information);
export default Information;