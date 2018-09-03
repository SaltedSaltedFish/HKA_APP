import './index.css';
import React,{ Component } from 'react';
import { Flex,ActivityIndicator } from 'antd-mobile';
import { Link } from 'react-router-dom';
import Api from '../../../api/request';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import Footer from '../../../components/Footer';
import FlightInfo from '../../../components/FlightInfo';

const FlexItem = Flex.Item;

class FlightDetails extends Component {
    constructor(props){
        super(props);

	    let url = '';
	    let aclogid = '';
	    let aclogid2 = '';
	    let flightdate = '';
	    let condition = {};
	    let fltid = '';
	    let longreg = '';
	    let parameter = props.location.search.replace('?','');

	    if (parameter.indexOf('work') == -1) {
		    parameter = parameter.split('&');
		    //url = 'acflight/flight/dateail';
		    url = 'workflight/flightdateail';

		    aclogid = parameter[0] == 'null'?'':parameter[0];
		    aclogid2 = parameter[1] == 'null'?'':parameter[1];
		    flightdate = parameter[2];

		    condition = {
			    aclogid,
			    aclogid2
		    };

	    } else {

		    url = 'acflight/flight/work/dateail';
		    parameter = parameter.replace(/work&/,'').split('&');

		    fltid = parameter[0];
		    flightdate = parameter[1];
		    longreg = parameter[2];

		    condition = {
			    fltid,
			    flightdate,
			    longreg
		    };
	    };

	    //console.log(parameter,parameter[3]);

	    this.aclogid = aclogid;
	    this.flightdate = flightdate;
	    this.url = url;

        this.state = {
            flightDate:null,
            workStatus:'',
            addList:[],

			isRequest:true,
	        condition,
	        latelyDate:'',
	        parameter
        };

        //console.log(this.state.condition);
    };

    componentWillMount(){

    };

    componentDidMount(){
	    Api.post(this.url,this.state.condition)
		    .then(res => {
			    let { flightDate,workStatus,addList,latelyDate } = this.state;
			    if ( res.errorCode == 0 && res.data ) {
				    flightDate = res.data.flightDetail;
				    workStatus = res.data.workStatus == ''?'0/0':res.data.workStatus;
				    addList = res.data.addList;
				    latelyDate = res.data.latelyDate;
				    //console.log(flightDate.nextAcFlightlog);
			    };

			    this.setState({
				    flightDate,
				    workStatus,
				    addList,
				    latelyDate,
				    isRequest:false
			    });
		    });
    };

    componentWillUnmount(){
        this.setState = _ =>{}
    };

    render(){
        const { flightDate,workStatus,isRequest,latelyDate,parameter } = this.state;
        let obj = flightDate? {
			flightno:flightDate.fltid,
			acreg:flightDate.acreg,
			flightdate:this.flightdate,
			depstn:flightDate.depstn,
			arrstn:flightDate.arrstn
		}:{};
        //console.log(obj);
        return (
			isRequest?
				<Content>
					<Header title=""/>
					<ActivityIndicator />
				</Content>:flightDate?
				<Content>
					<Header
						title={ flightDate.fltid }
					>
						{/*<Link*/}
							{/*to={{*/}
								{/*pathname: '/oiInput',*/}
								{/*search: '?'+JSON.stringify(obj),*/}
							{/*}}*/}
						{/*>*/}
							{/*<div className="icon icon-input">*/}

							{/*</div>*/}
						{/*</Link>*/}
					</Header>
					<FlightInfo data={flightDate}/>

					<FlightInfo className={`next-acflight`} data={flightDate.nextAcFlightlog} next={true}/>

					<div style={{padding:'0 .3rem'}}>
						<Flex className="details-state">
							{/*<FlexItem className="state-list">*/}
								{/*<Link to={{*/}
									{/*pathname:'addList',*/}
									{/*search:flightDate.acreg*/}
								{/*}}>*/}
									{/*<p className="font22">{flightDate.status}</p>*/}
									{/*<p className="font16 time" style={{minHeight:'.2rem'}}>{flightDate.flightdate}</p>*/}
									{/*<p className="font22 state">AC Status</p>*/}
								{/*</Link>*/}
							{/*</FlexItem>*/}

							{/*{*/}
								{/*parameter[2]?*/}
									{/*<FlexItem className="lm-state-list">*/}
										{/*<Link*/}
											{/*to={{*/}
												{/*pathname:'flight_order',*/}
												{/*search: flightDate.acreg + '&' + flightDate.fltid + '&' + flightDate.flightdate*/}
											{/*}}*/}
										{/*>*/}
											{/*<p className="title">*/}
												{/*Work Sheet*/}
											{/*</p>*/}

											{/*<p className="dec">*/}
												{/*<span className={`total`}>Total {workStatus.split("/")[1]}</span>*/}
												{/*<span className={`Unfinished`}>Unfinished {(workStatus.split("/")[1]) - (workStatus.split("/")[0])}</span>*/}
											{/*</p>*/}
										{/*</Link>*/}
									{/*</FlexItem>:null*/}
							{/*}*/}

							{/*<FlexItem className="state-list">*/}
								{/*<Link to={{*/}
									{/*pathname:'/security_log',*/}
									{/*search: '?' + flightDate.acreg + '&' + flightDate.fltid + '&' + flightDate.flightdate*/}
									{/*+ '&' + flightDate.aclogid*/}
									{/*,*/}
								{/*}}>*/}
									{/*<p className="font22"></p>*/}
									{/*<p className="font16 time" style={{minHeight:'.2rem'}}>{latelyDate}</p>*/}
									{/*<p className="font22 state">Maintenance</p>*/}
								{/*</Link>*/}
							{/*</FlexItem>*/}
						</Flex>

						<div className="list-container">
							<div className="details-list">
								<div className="list-title">
									ACREG
								</div>
								<div className="list-info">
									<div>{flightDate.acreg}</div>
								</div>
							</div>
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*EIC*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.eic}</div>*/}
								{/*</div>*/}
							{/*</div>*/}

							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*MECH*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.mech}</div>*/}
								{/*</div>*/}
							{/*</div>*/}

							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*TOWING INFO*/}
								{/*</div>*/}
								{/*<div className="list-info towing">*/}
									{/*<div></div>*/}
								{/*</div>*/}
							{/*</div>*/}

							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*ETD*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.etd}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*ETA*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.eta}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*ATA*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.ata}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*ATD*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.atd}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*STA*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.sta}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*STD*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.std}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*TOFF*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.toff}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
							{/*<div className="details-list">*/}
								{/*<div className="list-title">*/}
									{/*TDWN*/}
								{/*</div>*/}
								{/*<div className="list-info">*/}
									{/*<div>{flightDate.tdwn}</div>*/}
								{/*</div>*/}
							{/*</div>*/}
						</div>
					</div>

					<Footer>
						{/*<Link*/}
							{/*to={{*/}
								{/*pathname:'/report_fault',*/}
								{/*search: '?aclogid='+aclogid,*/}
								{/*state:flightDate*/}
							{/*}}*/}
						{/*>*/}
							{/*<div style={{textAlign:'center',color:'white'}}>*/}
								{/*Report Fault*/}
							{/*</div>*/}
						{/*</Link>*/}
						<Link
							to={{
								pathname: '/oiInput',
								//search: '?'+JSON.stringify(obj),
								state:obj
							}}
						>
							<div style={{textAlign:'center',color:'white'}}>
								Report OI
							</div>
						</Link>
					</Footer>
				</Content>:
				<Content>
					<Header title=""/>
					<div className="noData hasPadding">no Data</div>
				</Content>
        )
    }
}

export default FlightDetails;