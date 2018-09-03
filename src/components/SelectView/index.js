import './index.less';
import React,{Component} from 'react';
import {Flex} from 'antd-mobile';


const FlexItem = Flex.Item;

class SelectView extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        return (
            <div className="manual-select">
                <Flex className="mation-bottom">
                    <FlexItem onClick={this.modalType}>
                        <div className="mation-list">
                            <div className="icon icon-list-"></div>
                            <p>actype</p>
                        </div>
                    </FlexItem>
                    <FlexItem onClick={this.modalCat}>
                        <div className="mation-list">
                            <div className="icon icon-list-"></div>
                            <p>actype</p>
                        </div>
                    </FlexItem>
                </Flex>
            </div>
        )
    }
}

export default SelectView;
