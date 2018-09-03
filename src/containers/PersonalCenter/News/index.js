import './index.css';

import React,{ Component } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../../components/Header';
import Content from '../../../components/Content';

class MyNews extends Component {
    constructor(props){
        super(props);
        this.state = {

		};
    }

    render(){
        return (
            <Content
                className="myNews"
            >
                <Header title="Messages"/>
                <div className="mation-bottom">

                    {/*<Link*/}
                        {/*to={{*/}
                            {/*pathname:'/my_newDetails'*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<div className="mation-list">*/}
                            {/*<div className="icon icon-list-">*/}

                            {/*</div>*/}
                            {/*<span className="icon icon-notification"></span>*/}
                            {/*<p>System notification</p>*/}
                        {/*</div>*/}
                    {/*</Link>*/}

                    {/*<Link*/}
                        {/*to={{*/}
                            {/*pathname:'/my_applicationDetails'*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<div className="mation-list">*/}
                            {/*<div className="icon icon-list-"></div>*/}
                            {/*<span className="icon icon-feedback"></span>*/}
                            {/*<p>Application Feedback</p>*/}
                        {/*</div>*/}
                    {/*</Link>*/}

                    <Link
                        to={{
                            pathname:'/news_changeOf'
                        }}
                    >
                        <div className="mation-list">
                            <div className="icon icon-list-">

                            </div>
                            <span className="icon icon-changeOfWo"></span>
                            <p>Hand Over</p>
                        </div>
                    </Link>

                    <Link
                        to={{
							pathname:'/news_assign'
						}}
                    >
                        <div className="mation-list">
                            <div className="icon icon-list-">
                                {/*<span className="mation-badge"></span>*/}
                            </div>
                            <span className="icon icon-assign"></span>
                            <p>Assign</p>
                        </div>
                    </Link>

                    {/*<Link*/}
                        {/*to={{*/}
							{/*pathname:'/news_alarm'*/}
						{/*}}*/}
                    {/*>*/}
                        {/*<div className="mation-list">*/}
                            {/*<div className="icon icon-list-">*/}
								{/*/!*<span className="mation-badge"></span>*!/*/}
                            {/*</div>*/}
                            {/*<span className="icon icon-alarm"></span>*/}
                            {/*<p>Alarm</p>*/}
                        {/*</div>*/}
                    {/*</Link>*/}
                </div>
            </Content>
        )
    }
}

export default MyNews;