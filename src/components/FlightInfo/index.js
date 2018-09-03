import './index.css';
import './index.less';

import React,{Component} from 'react';
import {Flex} from 'antd-mobile';

const FlexItem = Flex.Item;

class FlightInfo extends Component {
    constructor(){
        super();
    }

    render(){
        const { data,next,className = '' } = this.props;  //  data 数据源,next 后续航班标识

        //console.log(data);

        if(!data && next) {
	        return null
        };

	    if(!data || ( !data.assignworkid && !data.aclogid )) {
		    return null
	    };

        return (
	        next?
		        <div className={`details-flight ${className}`}>
			        <div className="flight-top">
				        <p className={`next-flight`}>{data.fltid}</p>

				        <Flex
					        justify="between"
				        >
					        <FlexItem>
						        <div className="flight-address flight-start">
							        <div className="take-Ab">
								        {data.depstn}
							        </div>
							        {/*<div className="take-Full">*/}
							        {/*{data.depstn}*/}
							        {/*</div>*/}
							        <div className="take-time">
								        {data.etd1 || data.etd}
							        </div>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-icon"></div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-address flight-end">
							        <div className="take-Ab">
								        {data.arrstn}
							        </div>
							        {/*<div className="take-Full">*/}
							        {/*{data.arrstn}*/}
							        {/*</div>*/}
							        <div className="take-time">
								        {data.eta1 || data.eta}
							        </div>
						        </div>
					        </FlexItem>
				        </Flex>
			        </div>

			        <div className="flight-bottom">
				        <Flex
					        justify="between"
				        >
					        <FlexItem>
						        <div className="flight-info">
							        <p>GATE</p>
							        <p className="info single">{data.gate}</p>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-info">
							        <p>ETD</p>
							        <p className="info">
							        <span className="top">
								        {data.etd1 || data.etd}
							        </span>

							        {/*<span className="bottom">*/}
								        {/*{data.etdFomat || data.etd}*/}
							        {/*</span>*/}
							        </p>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-info">
							        <p>ATD</p>
							        <p className="info">
							        <span className="top">
								        {data.atd1 || data.atd}
							        </span>
							        {/*<span className="bottom">*/}
								        {/*{data.atdFomat || data.atd}*/}
							        {/*</span>*/}
							        </p>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-info">
							        <p>STATUS</p>
							        <p className="info single">{data.status}</p>
						        </div>
					        </FlexItem>
				        </Flex>
			        </div>

		        </div>
		        :
		        <div className={`details-flight ${className}`}>
			        <div className="flight-top">
				        <Flex
					        justify="between"
				        >
					        <FlexItem>
						        <div className="flight-address flight-start">
							        <div className="take-Ab">
								        {data.depstn}
							        </div>
							        {/*<div className="take-Full">*/}
							        {/*{data.depstn}*/}
							        {/*</div>*/}
							        <div className="take-time">
								        {data.etd1 || data.etd}
							        </div>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-icon"></div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-address flight-end">
							        <div className="take-Ab">
								        {data.arrstn}
							        </div>
							        {/*<div className="take-Full">*/}
							        {/*{data.arrstn}*/}
							        {/*</div>*/}
							        <div className="take-time">
								        {data.eta1 || data.eta}
							        </div>
						        </div>
					        </FlexItem>
				        </Flex>
			        </div>
			        <div className="flight-bottom">
				        <Flex
					        justify="between"
				        >
					        <FlexItem>
						        <div className="flight-info">
							        <p>GATE</p>
							        <p className="info single">{data.gate}</p>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-info">
							        <p>ETA</p>
							        <p className="info">
							        <span className="top">
								        {data.eta1 || data.eta}
							        </span>
							        {/*<span className="bottom">*/}
								        {/*{data.etaFomat || data.eta}*/}
							        {/*</span>*/}
							        </p>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-info">
							        <p>ATA</p>
							        <p className="info">
							        <span className="top">
								        {data.ata1 || data.ata}
							        </span>
							        {/*<span className="bottom">*/}
								        {/*{data.ataFomat || data.ata}*/}
							        {/*</span>*/}
							        </p>
						        </div>
					        </FlexItem>
					        <FlexItem>
						        <div className="flight-info">
							        <p>STATUS</p>
							        <p className="info single">{data.status}</p>
						        </div>
					        </FlexItem>
				        </Flex>
			        </div>
		        </div>
        )
    }
}

export default FlightInfo;
