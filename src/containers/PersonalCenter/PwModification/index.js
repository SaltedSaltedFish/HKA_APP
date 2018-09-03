

import React,{Component} from 'react';
import { Flex,Modal } from 'antd-mobile';

import Api from '../../../api/request';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import { createForm } from 'rc-form';

const FlexItem = Flex.Item;
class PwModification extends Component {
    constructor(props){
        super(props);
        this.state = {
            condition:{}
        };


        this.url = '';
    }



    componentDidMount(){

    }




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

    render(){
        const { getFieldProps } = this.props.form;
        return (
            <Content
                style={{
                    paddingBottom:0,
                    // paddingTop:'1rem'
                }}
            >
                <Header title="MODIFICATION">
                </Header>
                        <div className="from-input" style={{padding:'0.3rem'}}>
                            <from className="submit">
                                <div className="group-input">
                                    <span>Old passsword</span>
                                    <input type="text" style={{ paddingLeft: '2rem'}} {...getFieldProps('oldpassword',{
                                        initialValue:'',
                                    })}/>
                                </div>

                                <div className="group-input">
                                    <span>Password</span>
                                    <input type="text" style={{ paddingLeft: '1.5rem'}} {...getFieldProps('password',{
                                        initialValue:''
                                    })}/>
                                </div>

                                <div className="group-button">
                                    <div className="button red"  style={{width:'5.5rem'}} onClick={this.submit}>
                                        Change
                                    </div>
                                </div>
                            </from>
                        </div>
            </Content>
        )
    }
}

PwModification = createForm()(PwModification);
export default PwModification;/**
 * Created by Administrator on 2017/12/29/029.
 */
