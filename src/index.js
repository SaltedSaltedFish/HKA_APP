/**
 * Created by Thinkpad on 2017/6/2.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
    Route
} from 'react-router-dom';
import './style/main.css';
import './style/style.less';
import './style/adaptatio.less';
import './utils/backbutton';
import initReactFastclick from 'react-fastclick';
import Routes from './routes';
import { Provider } from 'react-redux';
import Store from './middlewares/configureStore';

initReactFastclick();

(function onPlusReady(){
	ReactDOM.render(
		<Provider store={Store}>
			<Router>
				<Routes {...Store}/>
			</Router>
		</Provider>,
		document.getElementById('root')
	);
})();

//document.addEventListener( "plusready", onPlusReady, false );