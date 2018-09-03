import './index.less';

import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {Flex} from 'antd-mobile';

import Content from '../../components/Content';
import { manualAC_CONFIG,manualHDBK,manualTECHNIC,manual_OHTER } from '../../data';

const FlexItem = Flex.Item;

let current = [];

class Manual extends Component {
    constructor(props){
        super(props);

        let manualState = sessionStorage.ManualState?eval('('+sessionStorage.ManualState+')'):
			{
				menu0:true,
				menu1:true,
				menu2:true,
				menu3:true,
				all:true
			};
        this.state = {
			...manualState
        };

        //console.log(this.state);
    }

    componentDidMount = _ => {

        this.clear = _ =>{
            Array.from(document.getElementsByClassName('active')).map(n=>{

                if(_.target != n) {
                    n.className = n.className.replace(' active','');
                }

            })
        };
    };

    componentWillUnmount(){
        sessionStorage.ManualState = JSON.stringify(this.state);
    }

    prevAll = _ => {

        let dom = _.target?_.target:_;

        if(dom.previousSibling) {
            current.push(dom.previousSibling);
            dom.previousSibling?this.prevAll(dom.previousSibling):null;
        }

        //return current;
    };

    screenAction0 = _ => {
        this.clear(_);
        let name = _.target.className;
        if(name.indexOf(' active') != -1){
            _.target.className = name.replace(' active','');
            this.setState({
                all:true
            });
            return;
        } else {
            _.target.className = name + ' active';
        }

        this.setState({
            menu0:true,
            menu1:false,
            menu2:false,
			menu3:false,
            all:false
        })
    };
    screenAction1 = _ => {
        this.clear(_);
        let name = _.target.className;
        if(name.indexOf(' active') != -1){
            _.target.className = name.replace(' active','');
            this.setState({
                all:true
            });
            return;
        } else {
            _.target.className = name + ' active';
        }
        this.setState({
            menu0:false,
            menu1:true,
            menu2:false,
			menu3:false,
            all:false
        })
    };
    screenAction2 = _ => {
        this.clear(_);
        let name = _.target.className;
        if(name.indexOf(' active') != -1){
            _.target.className = name.replace(' active','');
            this.setState({
                all:true
            });
            return;
        } else {
            _.target.className = name + ' active';
        }
        this.setState({
            menu0:false,
            menu1:false,
            menu2:true,
			menu3:false,
            all:false
        })
    };

	screenAction3 = _ => {
		this.clear(_);
		let name = _.target.className;
		if(name.indexOf(' active') != -1){
			_.target.className = name.replace(' active','');
			this.setState({
				all:true
			});
			return;
		} else {
			_.target.className = name + ' active';
		}
		this.setState({
			menu0:false,
			menu1:false,
			menu2:false,
			menu3:true,
			all:false
		})
	};

    render(){
        const {menu0,menu1,menu2,menu3,all} = this.state;
        let pathname = 'manual_details';
        return (
            <Content>
                <div id="common-header">
                    <p className="title">Search</p>
                </div>

                <div className="manual-container">

                    <Flex
                        className="manual-screen"
                    >
                        <FlexItem
                            onClick = { _=>this.screenAction0(_) }
                            className={`screen-menu menu0 ${!all?menu0?'active':'':''}`}
                        >
                            <p>Technic</p>
                        </FlexItem>
                        <FlexItem
                            onClick = { _=>this.screenAction1(_) }
                            className={`screen-menu menu1 ${!all?menu1?'active':'':''}`}
                        >
                            <p>AC Config</p>
                        </FlexItem>
                        <FlexItem
                            onClick = { _=>this.screenAction2(_) }
                            className={`screen-menu menu2 ${!all?menu2?'active':'':''}`}
                        >
                            <p>Hand Book</p>
                        </FlexItem>
                        <FlexItem
                            onClick = { _=>this.screenAction3(_) }
                            className={`screen-menu menu3 ${!all?menu3?'active':'':''}`}
                        >
                            <p>Other</p>
                        </FlexItem>
                    </Flex>

                    {
                        all?<div>
                            <div className="manual-list mation-bottom">
                                <h2>Technic</h2>
                                {
                                    manualTECHNIC.map((s,v)=>
                                        <Link
                                            to={{
                                                pathname:s.path,
												state:{
													cache:true
												}
                                            }}
                                            key={v}
                                        >
                                            <div className="mation-list">
                                                <div className="icon icon-list-"></div>
                                                <p>{s.name}</p>
                                            </div>
                                        </Link>
                                    )
                                }
                            </div>

                            <div className="manual-list mation-bottom">
                                <h2>AC Config</h2>
                                {
                                    manualAC_CONFIG.map((s,v)=>
                                        <Link
                                            to={{
                                                pathname:s.path,
												state:{
													cache:true
												}
                                            }}
                                            key={v}
                                        >
                                            <div className="mation-list">
                                                <div className="icon icon-list-"></div>
                                                <p>{s.name}</p>
                                            </div>
                                        </Link>
                                    )
                                }
                            </div>

                            <div className="manual-list mation-bottom">
								<h2>Hand Book</h2>
								{
									manualHDBK.map((s,v)=>
										<Link
											to={{
												pathname:s.path,
												state:{
													cache:true
												}
											}}
											key={v}
										>
											<div className="mation-list">
												<div className="icon icon-list-"></div>
												<p>{s.name}</p>
											</div>
										</Link>
									)
								}
							</div>
							<div className="manual-list mation-bottom">
								<h2>Other</h2>
								{
									manual_OHTER.map((s,v)=>
										<Link
											to={{
												pathname:s.path,
												state:{
													cache:true,
													state:{
														cache:true
													}
												}
											}}
											key={v}
										>
											<div className="mation-list">
												<div className="icon icon-list-"></div>
												<p>{s.name}</p>
											</div>
										</Link>
									)
								}
							</div>
                        </div>:
                        <div>
                            {
                                menu0?
                                    <div className="manual-list mation-bottom">
                                        {
                                            manualTECHNIC.map((s,v)=>
                                                <Link
                                                    to={{
                                                        pathname:s.path,
														state:{
															cache:true
														}
                                                    }}
                                                    key={v}
                                                >
                                                    <div className="mation-list">
                                                        <div className="icon icon-list-"></div>
                                                        <p>{s.name}</p>
                                                    </div>
                                                </Link>
                                            )
                                        }
                                    </div>:null
                            }

                            {
                                menu1?
                                    <div className="manual-list mation-bottom">
                                        {
                                            manualAC_CONFIG.map((s,v)=>
                                                <Link
                                                    to={{
                                                        pathname:s.path,
														state:{
															cache:true
														}
                                                    }}
                                                    key={v}
                                                >
                                                    <div className="mation-list">
                                                        <div className="icon icon-list-"></div>
                                                        <p>{s.name}</p>
                                                    </div>
                                                </Link>
                                            )
                                        }
                                    </div>:null
                            }

                            {
                                menu2?
                                    <div className="manual-list mation-bottom">
                                        {
                                            manualHDBK.map((s,v)=>
                                                <Link
                                                    to={{
                                                        pathname:s.path,
														state:{
															cache:true
														}
                                                    }}
                                                    key={v}
                                                >
                                                    <div className="mation-list">
                                                        <div className="icon icon-list-"></div>
                                                        <p>{s.name}</p>
                                                    </div>
                                                </Link>
                                            )
                                        }
                                    </div>:null
                            }
							{
								menu3?
									<div className="manual-list mation-bottom">
										{
											manual_OHTER.map((s,v)=>
												<Link
													to={{
														pathname:s.path,
														state:{
															cache:true
														}
													}}
													key={v}
												>
													<div className="mation-list">
														<div className="icon icon-list-"></div>
														<p>{s.name}</p>
													</div>
												</Link>
											)
										}
									</div>:null
							}
                        </div>
                    }
                </div>
            </Content>
        )
    }
}


export default Manual;