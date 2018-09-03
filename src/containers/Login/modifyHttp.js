import './index.css';

import React,{ Component } from 'react';
import { Button,Modal } from 'antd-mobile';

import Content from '../../components/Content';
import Header from '../../components/Header';

class ModifyHttp extends Component {
    constructor(props){
        super(props);

        this.option = [
	        {
	        	value:'http://192.168.130.200:8080/regularlycheck/'
	        },{
        	    value:'http://192.168.130.68:8080/'
	        },{
        	    value:'http://111.230.146.15/regularlycheck/'
	        }
        ];
    };

    componentDidMount(){

    };

    componentWillMount(){

    }

    componentWillUnmount(){

    };


    submit = _ => {
    	if ( this.refs.http2.value =='' ) {
		    this.refs.http2.value = this.refs.http1.value;
	    };
	    localStorage.HTTP = this.refs.http2.value;
	    Modal.alert('','请求地址已经换成'+this.refs.http2.value);
    };

    render(){
        return (
            <Content
                style={{paddingBottom:'0'}}
                className="login"
            >
	            <Header title={`Modify HTTP`}/>

                <div className="login-input">
                    <from className="submit">

	                    <select
		                    ref='http1'
		                    style={{
		                    	margin:'0 auto .5rem',
			                    width:'98%',
			                    display:'block'
		                    }}
		                    onChange={() => {
			                    localStorage.HTTP = this.refs.http1.value;
			                    Modal.alert('','请求地址已经换成'+this.refs.http1.value)
		                    }}
	                    >
		                    {
		                    	this.option.map(s =>
				                    <option
					                    key={s.value}
					                    value={s.value}
				                    >
					                    {s.value}
				                    </option>
			                    )
		                    }
	                    </select>

                        <div className="group-input"
                            style={{
                            	width:'96%',
	                            borderRadius:'0',
	                            padding:'0 5px'
                            }}
                        >
                            <input
	                            ref = 'http2'
								type="text"
	                            style={{
		                            padding:0
	                            }}
								placeholder={`自行输入地址`}
                            />
                        </div>
                        <div className="group-button">
                            <Button
                                className="button"
                                onClick={this.submit}
                            >
                                Modify
                            </Button>
                        </div>
                    </from>
                </div>

                <p className="help">Forgot password?</p>
            </Content>
        )
    }
}

export default ModifyHttp;