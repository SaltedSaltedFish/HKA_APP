import './index.css';

import React,{Component} from 'react';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import AddedList from './list';

class NRC extends Component {
    constructor(props){
        super(props);
        this.state = {

		};
    };

    componentWillMount(){

	}

    callback = key => {
        //console.log('onChange', key);
    };

    handleTabClick = key => {
        //console.log('onTabClick', key);
    };

    render(){
        return (
			<AddedList {...this.props}/>
        )
    }
}

export default NRC;