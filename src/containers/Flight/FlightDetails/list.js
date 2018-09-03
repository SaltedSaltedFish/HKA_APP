import './index.css';
import React,{Component} from 'react';

class List extends Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div>
                <div className="details-list">
                    <div className="list-title">
                        ETD
                    </div>
                    <div className="list-info">
                        <div>8:00am</div>
                    </div>
                </div>
                <div className="details-list">
                    <div className="list-title">
                        ETD
                    </div>
                    <div className="list-info">
                        <span className="img"></span>
                        <span className="img"></span>
                        <span className="img"></span>
                    </div>
                </div>
                <div className="details-list">
                    <div className="list-title">
                        ETD
                    </div>
                    <div className="list-info">
                        <span className="img"></span>
                    </div>
                </div>
            </div>
        )
    }
}

export default List;