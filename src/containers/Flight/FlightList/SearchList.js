import './SearchList.css';
import React,{Component} from 'react';

import { Flex ,ListView,List,Radio} from 'antd-mobile';
import { Link } from 'react-router-dom';

import Header from '../../../components/Header';
import Content from '../../../components/Content';
import ListViewComponent from '../../../components/ListView';
import ListViewTest from '../../../components/ListViewTest';
/**/
import FlightList from '../../../components/FlightList';
import LMFlightList from '../../../components/LM/FlightList';
/**/

import { list } from '../../../data/lmFlight';

const FlexItem = Flex.Item;
const RadioItem = Radio.RadioItem;

class SearchList extends Component {
    constructor(props){
        super(props);
        //this.showTimeType = sessionStorage.FlightDefaultKey;
        let condition = props.location.state?this.props.location.state:
	        eval('('+ sessionStorage.SearchCondition +')');
        this.state = {
	        condition,
            maskStyle:{},

	        width:'100%',

	        lmValue:{},  //  筛选
	        lmShow:false,
	        update:false,
        };

        this.url = 'acflight/flight/list';

	    this.data = [
		    { value: '2', label: 'Sort By Arrival Time' },
		    { value: '1', label: 'Sort by A/C' },
	    ];

    };

    componentWillMount(){

    };

	componentDidMount(){
		let width = 0;
		Object.keys(this.refs).map( s =>
			{
				//console.log(this.refs[s],this.refs[s].offsetWidth,this.refs[s].clientWidth,this.refs[s].scrollWidth);
				width += (this.refs[s].offsetWidth + 1);
			}
		);

		//console.log(width);

		width += 'px';

		this.setState({
			width
		})
	};

    componentWillUnmount(){
	    sessionStorage.SearchCondition = JSON.stringify(this.state.condition);
        this.setState = _ => {};
    }

	rows = (s,v) =>{
		return (
            <Link
                to={{
					pathname: '/flight_details',
					search: s.aclogid +'&'+this.state.condition.flightdate1,
				}}
                key={v}
            >
                <FlightList data={s} />
            </Link>
		)
	};

	LMrows = (s,v) => (
		<Link
			to={{
				pathname: '/flight_details',
				search: s.aclogid +'&'+this.state.date,
			}}
			key={v}
		>
			<LMFlightList data={s} />
		</Link>
	);

    showMask = () => {
        this.setState({
	        maskStyle:{
	            display:'flex'
            }
        })
    };

	onChange = (lmValue) => {
		let { condition } = this.state;
		condition.orderby = lmValue.value;
		this.setState({
			lmValue,
			condition,
			lmShow:false,
			update:true
		});
	};

    render(){
        const {condition,width,lmValue,lmShow} = this.state;

	    let isLM = Boolean(localStorage.isLM);

        return (
            <Content
                className="searchList"
                style={{paddingBottom:'0'}}
            >
                <Header title="SEARCH LIST" />

	            <div className={`lm-position ${lmShow?'lm-hidden':''}`} style={{height:'100%'}}>
		            <div className="lm-screen-box" style={lmShow?{display:'block'}:{display:'none'}}>
			            <div className="lm-mark"></div>
			            <div className="lm-screen">
				            <List>
					            { this.data.map(i => (
						            <RadioItem key={i.value} checked={lmValue.value === i.value} onChange={() => this.onChange(i)}>
							            {i.label}
						            </RadioItem>
					            ))}
				            </List>
			            </div>
		            </div>

		            <div
			            className={isLM?`tabs flight lm-container`:`tabs flight`}
			            style={isLM?{padding:'0',width:width}:{padding:'.3rem .3rem 0'}}
			            onClick={this.showMask}
		            >
			            {
				            isLM?
					            <ul className={`lm-flight title`}>
						            {
							            list.map( (s,v) =>
								            <li
									            className={s.icon || null}
									            ref={s.type}
									            key={v}
									            onClick={s.icon?()=>this.setState({lmShow:!this.state.lmShow,update:false}):null}
								            >
									            {s.name}
								            </li>
							            )
						            }
					            </ul>:null
			            }

			            <ListViewTest
				            rows={ isLM?this.LMrows:this.rows }
				            url={ this.url }
				            condition={ condition }
				            update = {this.state.update}
			            />
		            </div>
	            </div>
            </Content>
        )
    }
};

export default SearchList;