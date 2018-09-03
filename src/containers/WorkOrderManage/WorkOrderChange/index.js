import './index.css';

import React,{Component} from 'react';
import {createForm } from 'rc-form';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Footer from '../../../components/Footer';

let arry = [1,2,3,4,5,6,7,8,9,10];

class WorkOrderChange extends Component {
    constructor(){
        super();
    }

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
        });
    };

    render(){
        const { getFieldProps } = this.props.form;
        return (
            <div>
                <Header title="Modification"/>
                <Content
                    className="padding"
                >
                    <div className="modification">
                        <div className="modification-title">
                            WOLM17893
                        </div>
                        <div className="modification-list">
                            <div className="from-input">
                                <from className="submit">
                                    <div className="group-input">
                                        <span>Type</span>
                                        <input type="text" {...getFieldProps('type')}/>
                                    </div>

                                    <div className="group-input">
                                        <p>Description</p>
                                        <textarea
                                            cols="30"
                                            rows="10"
                                            {...getFieldProps('Description')}
                                        ></textarea>
                                    </div>

                                </from>
                            </div>
                        </div>
                    </div>
                </Content>
                <Footer>
                    <div onClick={this.submit}>
                        Submit
                    </div>
                </Footer>
            </div>
        )
    }
}
WorkOrderChange = createForm()(WorkOrderChange);
export default WorkOrderChange;