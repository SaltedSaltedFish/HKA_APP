import './index.less';

import React,{Component} from 'react';
import { Link } from 'react-router-dom';

import Content from '../../components/Content';

class Index extends Component {
    constructor(props){
        super(props);
        let identity = Boolean(Number(localStorage.identity));
        this.state = {
            data:[],
            isRequest:true,
			date:new Date().toString().split(' '),
			identity
        };
        this.timer = null;
        //this.identity = Boolean(Number(localStorage.identity));

        this.array = identity?[
			// {
			// 	pathname:'/admin_notice',
			// 	type:'un',
			// 	title:'Alarm'
			// },
	        {
				pathname:'/scanning',
				type:'scanning',
				title:'Scan'
			},
	        {
		        pathname:'/my_news',
		        type:'news',
		        title:'Messages'
	        },
	        {
		        pathname:'/sms',
		        type:'sms',
		        title:'SMS'
	        },
			// {
        		// pathname:'/application_manage',
        		// type:'re',
			// 	title:'Delay Request'
			// }
		]:[
			// {
			// 	pathname:'/admin_notice',
			// 	type:'un',
			// 	title:'Alarm'
			// },
	        {
		        pathname:'/scanning',
		        type:'scanning',
		        title:'Scan'
	        },
	        {
		        pathname:'/my_news',
		        type:'news',
		        title:'Messages'
	        },
	        {
		        pathname:'/sms',
		        type:'sms',
		        title:'SMS'
	        },
		];

        this.label = [
			// {
			// 	pathname:'/hour_statistics',
			// 	type:'hours',
			// 	title:'Man-Hours'
			// },
	        {
				pathname:'/news_changeOf',
				type:'ch',
				title:'Hand Over'
			},
			// {
			// 	pathname:'/my_news',
			// 	type:'news',
			// 	title:'Messages'
			// },
			// {
			// 	pathname:'/add_task',
			// 	type:'task',
			// 	title:'ADD NRC'
			// },
			// {
        	 //    pathname:'/sms',
		     //    type:'sms',
		     //    title:'SMS'
			// }
		];
    };

    componentWillMount(){

    };

	componentDidMount(){

	}

    componentWillUnmount(){
  		this.setState = _ => {};
    };

    render(){
        const { data ,isRequest,date,identity } = this.state;
        let dateList = [],priority;
        return (
            <div id="barcode">
                <Content
                    style={{paddingTop:'0'}}
                >
                    <div className="index-top">
                        <div className="logo">
                        </div>
                        <div className="date">
                            <div className="day">
                                <span className="num">{date[2]}</span>
                                <span>th</span>
                            </div>
                            <div className="year">
                                <span style={{paddingRight:'.1rem'}}>
                                    {date[1]}
                                </span>
                                <span>
                                    {date[3]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/*<div className="index-label">*/}
                        {/*<ul>*/}
                            {/*<li className="hours"></li>*/}

                            {/*<Link*/}
                                {/*to={{*/}
                                    {/*pathname: '/scanning'*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*<li className="scanning"></li>*/}
                            {/*</Link>*/}
                            {/*<Link*/}
                                {/*to={{*/}
                                    {/*pathname: '/my_news'*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*<li className="news"></li>*/}
                            {/*</Link>*/}
                            {/*<Link*/}
                                {/*to={{*/}
                                    {/*pathname: '/add_task',*/}
                                    {/*search: '?sort=name'*/}
                                {/*}}*/}
                            {/*>*/}
                                {/*<li className="task"></li>*/}
                            {/*</Link>*/}
                        {/*</ul>*/}
                    {/*</div>*/}

                    <div className="index-label">
                        <ul>
							{
								this.label.map(s=>
									<Link
										key={s.pathname}
										to={{
											pathname:s.pathname
										}}
									>
										<li className={s.type}>
											{s.title}
										</li>
									</Link>
								)
							}
                        </ul>
                    </div>


					<div className={`index-list ${identity?'admin':''}`}>
						<h2>Entrance</h2>
						<div style={{
							overflow:'auto',
							overflowY: 'hidden'
						}}>
							<ul>
								{
									this.array.map(s=>
										<li key={s.title} className={s.type}>
											<Link
												key={s.pathname}
												to={{
													pathname:s.pathname
												}}
											>
												{/*<span className="mation-badge">2</span>*/}
												<p>{s.title}</p>
											</Link>
										</li>
									)
								}
							</ul>
						</div>
					</div>

                </Content>
            </div>
        )
    }
}
export default Index;