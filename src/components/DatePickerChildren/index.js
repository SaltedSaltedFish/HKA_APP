import React,{ Component } from 'react';

export default class DatePickerChildren extends Component {
	constructor(props){
		super(props);
	};

	render(){
		const { style = {} } = this.props;
		return (
			<div
				onClick={this.props.onClick}
				style={{
					lineHeight: ".4rem",
					minHeight:'.4rem',
					...style
				}}
				className={this.props.className?this.props.className:null}
			>
				{this.props.extra}
			</div>
		)
	}
}