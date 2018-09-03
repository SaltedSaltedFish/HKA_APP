import './index.less';

import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';
import Content from '../../components/Content';

class SMSIndex extends Component {
	constructor(props){
		super(props);

		this.list = [
			{
				pathname:'/add_ior',
				type:'ior',
				title:'Raise IOR'
			},{
				pathname:'/add_hazard',
				type:'hzr',
				title:'Raise Hazard '
			},{
				pathname:'/my_reports',
				type:'ior',
				title:'My Reports'
			}
		];
	};

	render(){
		return (
			<Content>
				<Header title="SMS" />
				<div className="mation-bottom smsList">
					{
						this.list.map((s,v)=>
							<Link
								to={{
									pathname: s.pathname,
								}}
								key={v}
							>
								<div className="mation-list">
									<div className="icon icon-list-">

									</div>
									<span className={`icon icon-${s.type}`}></span>
									<p>{s.title}</p>
								</div>
							</Link>
						)
					}
				</div>
			</Content>
		)
	};
}

SMSIndex.propTypes = {

};

export default SMSIndex;