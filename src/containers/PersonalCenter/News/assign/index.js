
import React,{ Component } from 'react';
import { List,Flex,Checkbox,ListView } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';

import Api from '../../../../api/request';

import Header from '../../../../components/Header';
import Content from '../../../../components/Content';
import Footer from '../../../../components/Footer';
import ListViewComponent from '../../../../components/ListView';

const FlexItem = Flex.Item;
const CheckboxItem = Checkbox.CheckboxItem;

class NewsApplicationDetails extends Component {
    constructor(props){
        super(props);
        //console.log(props);
		let identity = Boolean(Number(localStorage.identity));
        this.state = {
            edit:false,
            checked:false,

			dataSource:false,
			refreshing:false,
			isLoading:true,
			pageNow:2,
			hasMore:false,
			totalPageSize:0,
			rollingState:false,

			condition:{
				pageNow:'1',
				type:'0'
			},

			array:[],

			path:'/work_details'
        };

		this.url = 'message/push/list';

		this.dataSource = new ListView.DataSource({
			rowHasChanged : (row1,row2) => row1 !== row2  // 只更新于有变化的数据
		});

		this.getFieldProps = props.form.getFieldProps;
    };

	componentWillMount(){
		this.update();
	};

	update = () => {
		const { condition } = this.state;
		return Api.post(this.url,{...condition})
			.then(res => {
				let dataSource = this.dataSource.cloneWithRows(res.pageInfo.pageData);
				this.state.array = res.pageInfo.pageData;
				//console.log(res);
				this.setState({
					dataSource,
					totalPageSize:res.pageInfo.totalPageSize,
					hasMore:false,
					pageNow:2
				})
			})
	};

	onRefresh = () => {
		this.setState({ refreshing: true });
		this.update()
			.then( _ => {
				this.setState({
					refreshing: false
				});
			})
		//this.refs.lv.scrollTo(0, 5400)
	};

	onEndReached = _ =>{
		let {isLoading,pageNow,hasMore,totalPageSize,condition} = this.state;

		if( totalPageSize < pageNow ){
			this.setState({
				hasMore:true
			});

			return;
		}

		this.setState({
			rollingState:true
		});

		if(isLoading && !hasMore) {
			condition.pageNow = pageNow;
			this.state.isLoading = false; //  改变但不刷新状态
			Api.post(this.url,condition)
				.then(res => {
					if(res.errorCode == 0) {
						let data = res.pageInfo.pageData;
						this.state.array.push(...data);
						pageNow+=1;
						this.setState({
							dataSource:this.dataSource.cloneWithRows(this.state.array),
							pageNow:pageNow,
							isLoading:true,
							rollingState:false,
							condition
						})
					}
				});
		}
	};

	rowEdit = (s,v) =>{
		let state = s.readflag == '1'?'arrow':'';
		return (
			<List className="list-container">
				<CheckboxItem
					key={v}
					onChange={() => this.onChange(s)}
					onClick = { e=>this.open(e) }
					{...this.getFieldProps(s.label,{
						valuePropName:'checked'
					})}
				>
					<div className={`list ${state}`}>
						<div className='list-content'>
							<span className="icon icon-newsDetails"></span>
							<span className="icon icon-newsArrow"></span>
							<p className="title">{s.title}</p>
							<p className="time">{s.createdwhen}</p>
							<p className="describe">
								{s.content}
							</p>
						</div>
					</div>
				</CheckboxItem>
			</List>
		)
	};

	rowDefault(s,v){
		let state = s.readflag == '1'?'arrow':'';
		let content = s.content.split(':');

		let info = content[1].indexOf(',') != -1?content[1].split(','):[];

		//console.log(content[0],info);

		return (
			<List>
				<Link
					to={{
						pathname:this.state.path,
						state:s,
						search:'?id=' + s.tskid
					}}
				>
					<div className={`list ${state}`} key={v}>
						<div className='list-content'>
							<span className="icon icon-newsDetails"></span>
							{/*<span className="icon icon-newsArrow"></span>*/}
							<p className="title">{s.createdby} {s.title}</p>
							<p className="time">{s.createdwhen}</p>
							<p className="describe">
								{content[0]} : {info[0]}
							</p>
							<p className="describe" style={{marginTop:'.1rem'}}>
								Acreg : {info[1]}
							</p>
							<p className="describe" style={{margin:'.1rem 0 .2rem'}}>
								Flight No. {info[2]}
							</p>
						</div>
					</div>
				</Link>
			</List>
		)
	}

    onChange = (val) => {
        console.log(val);
    };

    clickHandle = _ => {
        this.props.history.goBack();
    };

    componentDidMount(){
        this.open = e => {
            console.log('展开');
        };
    }

    submit = _ => {
        this.props.form.validateFields((error, value) => {
            console.log(error, value);
        });
    };

    edit = _ => {
        this.setState({
            edit:!this.state.edit
        });
    };

    selectFn = b => {
        let obj = {};
        data.map( _ => obj[_.label] = b);
        console.log(obj);
        this.props.form.setFieldsValue(obj);
    };

    select = _ => {
        this.selectFn(true);
        this.setState({
            checked:true
        });
        console.log('全选');
    };

    cancel = _ => {
        this.selectFn(false);
        this.setState({
            checked:false
        });
        console.log('取消');
    };

    render(){

        const { edit,checked,refreshing,dataSource,hasMore,rollingState } = this.state;
        const { getFieldProps } = this.props.form;
        return (
            <Content
                className="newsDetails"
				style={!edit?{paddingBottom:'0'}:{}}
            >
				<Header
					title="Assign"
				>
					{/*<div*/}
					{/*className={`icon ${edit?'icon-complete':'icon-edit'}`}*/}
					{/*onClick={this.edit}*/}
					{/*>*/}

					{/*</div>*/}
				</Header>

				<ListViewComponent
					style={!edit?{height:'93vh'}:{height:'85vh'}}
					dataSource={dataSource}
					hasMore={hasMore}
					rollingState={rollingState}
					rows={edit?this::this.rowEdit:this::this.rowDefault}
					refreshing={refreshing}
					onRefresh={this.onRefresh}
					onEndReached = {this.onEndReached}
				/>

                {
                    edit?
						<Footer
							style={{padding:'0 .3rem'}}
						>
							<Flex
								className="edit"
							>
								{
									checked?
										<FlexItem
											onClick = {this.cancel}
										>
											<span className="icon icon-checked"></span>

											Check all
										</FlexItem>
										:
										<FlexItem
											onClick={this.select}
										>
											<span className="icon icon-check"></span>

											Check all
										</FlexItem>
								}
								<FlexItem
									onClick={this.submit}
								>
									<span className="icon icon-newsDetailsRead"></span>
									Mark read
								</FlexItem>
								<FlexItem>
									<span className="icon icon-delete"></span>
									Delete
								</FlexItem>
							</Flex>
						</Footer>
                        :null
                }
            </Content>
        )
    }
}

NewsApplicationDetails = createForm()(NewsApplicationDetails);
export default NewsApplicationDetails;