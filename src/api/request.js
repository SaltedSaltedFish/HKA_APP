/**
 * Created by admin on 2017/7/12.
 */

import React,{ Component } from 'react';
import fetch from 'isomorphic-fetch';
import Native from '../utils/Native';

// 需要替换测试地址，暂时的处理方式
let URL = httpRequest;

function checkStatus (res){
    if (res.status >= 200 && res.status < 300) {
        return res;
    }
    const error = new Error(res.statusText);
    error.res = res;
    throw error;
};

function checkCode (res){
    //console.log(res);
    if (res.errorCode == -1) {
        //message.warning('系统错误');
    } else if(res.errorCode == -2) {
        console.log('登录信息过期');
        Native.alert('Login expired');
		sessionStorage.clear();
        window.location.href = '#/login';
    } else if (res.errorCode == 1) {
        //message.warning(res.errorMsg);
    } else if (res.errorCode == -3) {
        //message.warning(res.errorMsg);
        //if(res.msg == 'need login'){
            //message.warning('登陆信息过期');
            window.location.href = '#/login';
        //}
    }
};

function timeout(promise) {
    return new Promise(function(resolve, reject) {
        //  超时控制
        setTimeout(function() {
            reject({timeout:'timeout'});
        }, 100000000000);
        promise.then(resolve, reject);
    })
}

function test (url) {
    const reg = new RegExp('login');
    const regCode = new RegExp('getImageCode');

    reg.test(url);
}
class _Api {
    constructor(){
        this.get = (url,postData) => {
            if (postData) {
                let a = Object.keys(postData);
                let text = '';
                a.map(s=>{
                    if (postData[s]){
						text += (s + '=' + postData[s] + '&');
                    }
                    //!postData[s]?postData[s] = '':postData[s];
                    //text += (s + '=' + postData[s] + '&');
                });
                url = url+ '?'+ text;
            } else {
                url +='?'
            }

            url += 'apptoken='+localStorage.token + '&userAccount=' + localStorage.userAccount;
            let request = new Request(httpRequest+url,{
                method:'GET'
            });
            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json()
                })
                .then(json => {

                    checkCode(json);
                    return json
                })
                .catch(error => {
                    console.log(error,error.timeout);
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
        this.post = (url,postData = {}) =>{

            if( url.indexOf('login') == -1 ) {
                // url = url+'?access_token='+token;
                // postData.apptoken = token;
                postData.apptoken = localStorage.token;
                postData.userAccount = localStorage.userAccount;
            };

            let formData = new FormData();

            for (let v in postData) {
                if(!postData[v]) {
                    postData[v] = '';
                }
                formData.append(v,postData[v]);
            };

            let request = new Request(httpRequest+url,{
                method:'POST',
                body:formData,
                //credentials: "include"    //  携带cookie
            });

            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json();
                })
                .then(json => {
                    checkCode(json);
                    return json
                })
                .catch(error => {
                    //console.log(error,error.timeout);
                    if(error.timeout == 'timeout') {
                        //message.warning('服务器请求超时')
                    }
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
        this.put = (url,putData) => {

            url = url+'?access_token='+token;
            let formData = new FormData();
            for (let v in putData) {
                if(!putData[v]) {
                    putData[v] = '';
                }
                formData.append(v,putData[v]);
            }
            let request = new Request(httpRequest+url,{
                method:'POST',  //  暂时使用POST代替PUT请求
                body:formData,
                //credentials: "include"    //  携带cookie
            });

            return timeout(fetch(request))
                .then(res => {
                    checkStatus(res);
                    return res.json();
                })
                .then(json => {
                    checkCode(json);
                    return json
                })
                .catch(error => {
                    console.log(error,error.timeout);
                    //message.warning('服务器请求超时');
                    return error;
                });
        };
    }
}

const Api = new _Api();

export default Api
