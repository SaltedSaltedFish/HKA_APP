import './index.less';

import React,{Component} from 'react';
import { ActivityIndicator } from 'antd-mobile';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

import TimeConversion from '../../../utils/TimeConversion';
import Api from '../../../api/request';

class MaintenanceDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:null,
            isRequest:true
        };

        this.url = 'maintenance/detail';
    };

    componentWillMount(){
        const tipid = this.props.location.search.replace('?','');
        Api.post(this.url,{tipid})
            .then(res => this.setState({
                data:res.data.maintenance,
                isRequest:false
            }))
    };

	imgSrc = Obj =>{
		let obj = Obj.toString();

		if (obj.indexOf('<span style="') != -1) {
			obj = obj.replace(/style=[\s\S]*">/g,function (word) {
				return 'style="">';
			});
        };

		if (obj.indexOf('<img') != -1) {
			obj = obj.replace(/src='/g,"src='"+httpRequest);
			let http = httpRequest.replace('regularlycheck/','');

			obj = obj.replace(/src="[\S]*"/g,function (text) {
				if (text.indexOf('http:') != -1) {
					return text;
				} else {
					return text.replace('../../',http);
				};
				return 'src=""';
			});
		};

		return obj;
	};

    render(){
        const {data,isRequest} = this.state;

        if ( data && data.background ) {
	        data.background = this.imgSrc(data.background);
        };

	    if ( data && data.content ) {
		    data.content = this.imgSrc(data.content);
	    };


        return (
            <Content
                style={{paddingBottom:0}}
            >
                <Header title={data?data.fileno:''}/>
                {
                    isRequest?<ActivityIndicator />:
                        <div className="manual-three">
							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">ACTYPE</div>
									<div className="list-info">
										<div>{data.actype}</div>
									</div>
								</div>
							</div>
                            <div className="manual-list">
                                <div className="details-list">
                                    <div className="list-title">ATA</div>
                                    <div className="list-info">
                                        <div>{data.ata}</div>
                                    </div>
                                </div>
                            </div>
							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">issue</div>
									<div className="list-info">
										<div>{data.issue?TimeConversion.TIME(data.issue):''}</div>
									</div>
								</div>
							</div>
							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">revision</div>
									<div className="list-info">
										<div>{data.revision}</div>
									</div>
								</div>
							</div>

							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">fileno</div>
									<div className="list-info">
										<div>{data.fileno}</div>
									</div>
								</div>
							</div>

							<div className="manual-list">
								<div className="details-list">
									<div className="list-title">topic</div>
									<div className="list-info">
										<div>{data.topic}</div>
									</div>
								</div>
							</div>

							<div className="main">BACKGROUND:</div>
							<div
								dangerouslySetInnerHTML={{__html: data.background}}
								className="manual-describe maintenance"
							>

							</div>
							<div className="main">CONTENT:</div>
							<div
								dangerouslySetInnerHTML={{__html: data.content}}
								className="manual-describe maintenance"
							>

							</div>

                        </div>
                }

            </Content>
        )
    }
}


export default MaintenanceDetails;