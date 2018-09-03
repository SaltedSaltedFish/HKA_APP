import './index.css';

import React,{Component} from 'react';

class Group extends Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div className="people-group">
                <h2 className="font26">A</h2>
                <div className="skill-group">
                    <p className="skill-title">
                        ENGINEER
                    </p>
                    <div className="skill-people">
                        <div className="skill-info">
                            <p>BEN HUNG</p>
                            <span className="skill-head"></span>
                            <span className="skill-select default"></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Group;