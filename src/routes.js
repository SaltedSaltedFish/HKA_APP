/**
 * Created by Thinkpad on 2017/6/23.
 */
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';

import Login from './containers/Login';
import ModifyHttp from './containers/Login/modifyHttp';

import Home from './containers/Home';

import WorkOrderDetails from './containers/WorkOrderManage/WorkOrderDetails';
import DetailsAssigned from './containers/WorkOrderManage/WorkOrderDetails/indexAssigned';
import DetailsRelation from './containers/WorkOrderManage/WorkOrderDetails/indexNotrelated';
import DetailsPending from './containers/WorkOrderManage/WorkOrderDetails/indexPending';
import MaterialQuery from './containers/WorkOrderManage/MaterialQuery';

import AddTask from './containers/WorkOrderManage/AddTask';
import JobFeedback from './containers/WorkOrderManage/JobFeedback';
import WorkOrderChange from './containers/WorkOrderManage/WorkOrderChange';
import PersonnelSelection from './containers/PersonnelSelection';
import EngineerSelection from './containers/PersonnelSelection/indexEngineer';
import HandoverSelection from './containers/PersonnelSelection/handover';

import FlightDetails from './containers/Flight/FlightDetails';
import FlightSearch from './containers/Flight/FlightSearch';
/*tlb*/
import SecurityLog from './containers/Flight/SecurityLog';
import SecurityDetails from './containers/Flight/SecurityLog/details';
/**/
import ReportFault from './containers/Flight/ReportFault';
import SearchList from './containers/Flight/FlightList/SearchList';
import FlightGateChange from './containers/Flight/FlightGateChange';
import AircraftStatus from './containers/Flight/AircraftStatus';
import FlightWorkOrder from './containers/Flight/WorkOrder';
import AcStatus from './containers/Flight/AcStatus';
import OIINPUT from './containers/Flight/OIPUT';

import Deferral from './containers/Application/Deferral';
import Handover from './containers/Application/Handover';

import NRC from './containers/PersonalCenter/Added';
import NRCDetails from './containers/PersonalCenter/Added/details';

import MyApplication from './containers/PersonalCenter/Application';
import MyApplicationDetails from './containers/PersonalCenter/Application/details';

import MyNews from './containers/PersonalCenter/News';
import MyNewsDetails from './containers/PersonalCenter/News/details';
import NewsApplicationDetails from './containers/PersonalCenter/News/application';
import NewsChangeOf from './containers/PersonalCenter/News/change';
import NewAssign from './containers/PersonalCenter/News/assign';
import Alarm from './containers/PersonalCenter/News/Alarm';

import ApplicationManage from './containers/PersonalCenter/ApplicationManage';
import ApplicationDetails from './containers/PersonalCenter/ApplicationManage/details';
import PersonalManage from './containers/PersonalCenter/PersonalManage';
import PersonalDetails from './containers/PersonalCenter/PersonalManage/details';
import HourStatistics from './containers/PersonalCenter/HourStatistics';
import AdminNotice from './containers/PersonalCenter/AdminNotice';

/*手册*/
import ManualMenu  from './containers/Manual/menu';
import ManualMenuADD  from './containers/Manual/menuADD';
import ManualMenuDAM  from './containers/Manual/menuDAM';
import ManualDetails  from './containers/Manual/details';
import AMMList  from './containers/Manual/AMMList';
import MODList  from './containers/Manual/MODList';
import ManualMenuMOD  from './containers/Manual/menuMOD';
import SBList  from './containers/Manual/SBList';
import ManualMenuSB  from './containers/Manual/menuSB';
import FLSList  from './containers/Manual/FLSList';
import ManualMenuFLS  from './containers/Manual/menuFLS';
import DAMList  from './containers/Manual/DAMList';
import ADDList  from './containers/Manual/ADDList';
import Parts  from './containers/Manual/parts';
import PartsDetails  from './containers/Manual/parts/details';
import Oi  from './containers/Manual/oi';
import OiDetails  from './containers/Manual/oi/details';
import TAList  from './containers/Manual/TA';
import TADetails  from './containers/Manual/TA/details';
import Tblist  from './containers/Manual/TBList';
import TbDetails  from './containers/Manual/TBList/details';
import Addoil  from './containers/Manual/oil/Addoil';
import OilList  from './containers/Manual/oil/OilList';
import IpcManual  from './containers/Manual/IpcManual';
import IpcDetails  from './containers/Manual/IpcManual/details';
import Trendmap  from './containers/Manual/oil/Trendmap';
import MelOne  from './containers/Manual/Mel';
import MelDetails  from './containers/Manual/Mel/details';
import MelDetailsTwo  from './containers/Manual/Mel/detailstwo';
import MelDetailslast  from './containers/Manual/Mel/detailslast';
import MelDetailsthree  from './containers/Manual/Mel/detailsthree';
import TsmList  from './containers/Manual/Tsm';
import TsmDetails  from './containers/Manual/Tsm/details';

import SrmList  from './containers/Manual/Srm';
import SrmDetails  from './containers/Manual/Srm/details';


import Maintenance  from './containers/Manual/Maintenance';
import MaintenanceDetails  from './containers/Manual/Maintenance/details';
/*扫描反馈*/
import Scanning  from './components/Scanning';
import ScaJobFeedback  from './components/Scanning/feedback';

/*by hu-feng*/
import PwModification  from './containers/PersonalCenter/PwModification';
import PeInModification  from './containers/PersonalCenter/PeInModification';
import DelayReportList from './containers/DelayReport';

/*SMS*/
import ADDIor from './containers/SMS/addIor';
import ADDHazard from './containers/SMS/addHazard';
import IORList from './containers/SMS/iorList';
import HZRList from './containers/SMS/hzrList';
import SMSIndex from './containers/SMS';
import MyReports from './containers/SMS/myReports';
import ReportsDetails from './containers/SMS/details';

/*按需*/
import Bundle from './components/Bundle';

class ReactChildrenMap extends React.PureComponent {
	render() {
		return <div>{React.Children.map(this.props.children, children => children)}</div>
	}
}

const isLoggedIn = (props) => {

    if (!localStorage.LOGINMATION && props.pathname != '/login') {
        //return false;
	    return true;
    };

    return true;
};

const array = [
	{
		path:'/add_ior',
		component:ADDIor
	},{
		path:'/sms',
		component:SMSIndex
	},{
		path:'/add_hazard',
		component:ADDHazard
	},{
		path:'/my_reports',
		component:MyReports
	},{
		path:'/reports_details',
		component:ReportsDetails
	}

	,{
		path:'/ior_list',
		component:IORList
	},{
		path:'/hzr_list',
		component:HZRList
	},{
		path:'/ta_list',
		component:TAList
	},{
		path:'/ta_details',
		component:TADetails
	},{
		path:'/maintenance',
		component:Maintenance
	},{
		path:'/maintenance_details',
		component:MaintenanceDetails
	},{
		path:'/srm_list',
		component:SrmList
	},{
		path:'/srm_details',
		component:SrmDetails
	}
];

export default (store) => (
	<Route
		render={({location})=>{
			return (
				<CSSTransitionGroup
					transitionName={store.getState().global.animateCls}
					transitionEnter={true}
					transitionLeave={true}
					transitionEnterTimeout={MS}
					transitionLeaveTimeout={MS}>
					<ReactChildrenMap key={location.pathname}>
						{/*<Route exact path="/" component={Home} />*/}
						<Route exact path="/" render={(props)=>(
							isLoggedIn(props)?(<Home {...props}/>):(<Redirect to="/login"/>)
						)}/>

						{/***/}
						<Route path="/login" component={Login} />
						<Route path="/modify_http" component={ModifyHttp} />
						{/*end*/}

						<Route path="/work_details" component={WorkOrderDetails} />
						<Route path="/material_query" component={MaterialQuery} />
						<Route path="/add_task" component={AddTask} />
						<Route path="/job_feedback" component={JobFeedback} />
						<Route path="/work_change" component={WorkOrderChange} />
						<Route path="/details_assigned" component={DetailsAssigned} />
						<Route path="/details_relation" component={DetailsRelation} />
						<Route path="/details_pending" component={DetailsPending} />


						<Route path="/flight_details" component={FlightDetails} />
						<Route path="/flight_search" component={FlightSearch} />
						<Route path="/flight_gate" component={FlightGateChange} />

						<Route path="/report_fault" component={ReportFault} />
						<Route path="/security_log" component={SecurityLog} />
						<Route path="/security_de" component={SecurityDetails} />

						<Route path="/search_list" component={SearchList} />
						<Route path="/aircraft_tatus" component={AircraftStatus} />
						<Route path="/flight_order" component={FlightWorkOrder} />
						<Route path="/ac_status" component={AcStatus} />
						<Route path="/oiInput" component={OIINPUT} />

						<Route path="/personnel_selection" component={PersonnelSelection} />
						<Route path="/engineer_selection" component={EngineerSelection} />
						<Route path="/handover_selection" component={HandoverSelection} />
						<Route path="/deferral" component={Deferral} />
						<Route path="/handover" component={Handover} />

						<Route path="/nrc" component={NRC} />
						<Route path="/nrc_details" component={NRCDetails} />

						<Route exact path="/my_application" component={MyApplication} />
						<Route path="/my_application_details" component={MyApplicationDetails} />

						<Route path="/application_manage" component={ApplicationManage} />
						<Route path="/application_details" component={ApplicationDetails} />

						<Route path="/personal_manage" component={PersonalManage} />
						<Route path="/personal_details" component={PersonalDetails} />
						<Route path="/hour_statistics" component={HourStatistics} />
						<Route path="/admin_notice" component={AdminNotice} />

						<Route path="/my_news" component={MyNews} />
						<Route path="/my_newDetails" component={MyNewsDetails} />
						<Route path="/my_applicationDetails" component={NewsApplicationDetails} />
						<Route path="/news_changeOf" component={ NewsChangeOf } />
						<Route path="/news_assign" component={ NewAssign } />
						<Route path="/news_alarm" component={ Alarm } />

						<Route path="/manual_menu" component={ManualMenu} />
						<Route path="/ammList" component={AMMList} />
						<Route path="/modList" component={MODList} />
						<Route path="/sbList" component={SBList} />
						<Route path="/flsList" component={FLSList} />
						<Route path="/damList" component={DAMList} />
						<Route path="/addList" component={ADDList} />
						<Route path="/manual_menuADD" component={ManualMenuADD} />
						<Route path="/manual_details" component={ManualDetails} />
						<Route path="/damdetails" component={ManualMenuDAM} />
						<Route path="/sbdetails" component={ManualMenuSB} />
						<Route path="/moddetails" component={ManualMenuMOD} />
						<Route path="/flsdetails" component={ManualMenuFLS} />
						<Route path="/parts" component={Parts} />
						<Route path="/parts_details" component={PartsDetails} />
						<Route path="/oi" component={Oi} />
						<Route path="/oi_details" component={OiDetails} />
						<Route path="/tbList" component={Tblist} />
						<Route path="/tb_details" component={TbDetails} />
						<Route path="/addoil" component={Addoil} />
						<Route path="/oilList" component={OilList} />
						<Route path="/ipcManual" component={IpcManual} />
						<Route path="/ipcDetails" component={IpcDetails} />
						<Route path="/trendmap" component={Trendmap} />
						<Route path="/melOne" component={MelOne} />
						<Route path="/melDetails" component={MelDetails} />
						<Route path="/melDetailsTwo" component={MelDetailsTwo} />
						<Route path="/melDetailslast" component={MelDetailslast} />
						<Route path="/melDetailsthree" component={MelDetailsthree} />

						<Route path="/scanning" component={ Scanning } />
						<Route path="/sca_job_feedback" component={ ScaJobFeedback } />

						<Route path="/delay_reportList" component={DelayReportList} />
						<Route path="/pwModification" component={PwModification} />
						<Route path="/peInModification" component={PeInModification} />
						<Route path="/tsmList" component={TsmList} />
						<Route path="/tsmdetails" component={TsmDetails} />

						{
							array.map((s,v)=>
								<Route
									key={v}
							        path={s.path}
									component={s.component}
								/>
							)
						}

					</ReactChildrenMap>
				</CSSTransitionGroup>
			)
		}}
	>
	</Route>
);