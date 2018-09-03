import './details.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';
import Api from '../../../api/request';
import Header from '../../../components/Header';
import Content from '../../../components/Content';

let Personal = _ =>
	<div className="card">
		<div className="portrait"></div>
		<h1>姓名</h1>
		<p className="info uppercase">
			<span className="icon icon-people"></span>
			ENGINEER GROUP A
		</p>
		<p className="phone">
			<span className="icon icon-phone"></span>
			12345678
		</p>
	</div>
let Emp = _ =>
	<div className="card">
		<div className="portrait"></div>
		<h1>姓名</h1>
		<p className="info uppercase">
			<span className="icon icon-people"></span>
			ENGINEER GROUP A
		</p>
		<p className="phone">
			<span className="icon icon-phone"></span>
			12345678
		</p>
	</div>

class PersonalDetails extends Component {
    constructor(props){
        super(props);
        let type = props.location.search.replace('?','') == ''?false:
			props.location.search.replace('?','');
        this.state = {
	  		data:null,
			isRequest:true,
			type
        };

        console.log(type);
    }

    componentWillMount(){
        //console.log(this.props);
        //const id = this.props.location.state.engineer;
        Api.get('workorder/getUserInfo')
            .then(res => {
                if(res.errorCode == 0) {
                    this.setState({
						isRequest:false,
                        data:res.data,
                    })
                } else {
                	this.setState({
						isRequest:false,
					})
				}
            });
    }

    render(){
        const { data ,isRequest ,type} = this.state;
        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title="SCHEDULING"/>

				{
					type?<Emp />:<Personal />
				}

				<div className="details-bottom">

					<div className="details-list">
						<div className="list-title">
							Age
						</div>
						<div className="list-info">
							<div>28</div>
						</div>
					</div>

					<div className="details-list">
						<div className="list-title">
							Education
						</div>
						<div className="list-info">
							<div>1</div>
						</div>
					</div>
				</div>

				{
					isRequest? <ActivityIndicator />:
						data?
							<div>
								<div className="card">
									<div className="portrait"></div>
									<h1>{data.sysuser}</h1>
									<p className="info uppercase">
										<span className="icon icon-people"></span>
										{data.category} GROUP {data.teams}
									</p>
									<p className="phone">
										<span className="icon icon-phone"></span>
										{data.phoneno}
									</p>
								</div>

								<div className="details-bottom">

									<div className="details-list">
										<div className="list-title">
											Age
										</div>
										<div className="list-info">
											<div>{data.age}</div>
										</div>
									</div>

									<div className="details-list">
										<div className="list-title">
											Education
										</div>
										<div className="list-info">
											<div>{data.education}</div>
										</div>
									</div>

								</div>
							</div>
							:
							<div className="noData hasPadding">No Date</div>
				}

            </Content>
        )
    }
}

export default PersonalDetails;