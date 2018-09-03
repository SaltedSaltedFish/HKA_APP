/**
 * Created by Thinkpad on 2017/6/3.
 */
import './index.css';
import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { currentAnimate } from '../../actions/currentAnimate';


class Header extends React.Component {
    constructor(props) {
        super(props);
    };

	componentWillMount(){
		this.props.dispatch(currentAnimate('left'));
	};

    componentWillUnmount(){
        //backbutton = this.props;
    };

	componentDidMount(){

	};

    clickHandle = _ =>{
        //console.log(this.props);
		this.props.dispatch(currentAnimate('right'));
        this.props.history.goBack();
    };

    render() {
        let {style} = this.props;
        if (!style) {
        	style= {}
		};
        return (
            <div
				id="common-header"
				style={{...style}}
			>
                <div
                    className="back"
                    onClick={this.clickHandle}
                >
                </div>
				{ this.props.children }
	            {
		            this.props.title?<p className="title">{ this.props.title }</p>:null
	            }

            </div>

        )
    }
}
Header = connect()(Header);
Header = withRouter(Header);
export default Header;
