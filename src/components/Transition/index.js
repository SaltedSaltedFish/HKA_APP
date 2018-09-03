import './index.less';
import React,{Component} from 'react';
import { Transition} from 'react-transition-group';

const transitionStyles = {
    entered: { opacity: 1},
    exiting: { opacity: 0},
};
const duration = 200;
const defaultStyle = {
    transition: `opacity ${duration}ms`,
    opacity: 0,
};

class TransitionContainer extends Component {
    constructor(){
        super();
    };

    render(){
        return (
            <div
                className={`transitionContainer`}
            >
				{ this.props.children }
            </div>
        )
    }
};

export default TransitionContainer;