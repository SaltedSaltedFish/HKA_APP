import './index.css';

import React,{ Component } from 'react';
import { List,Flex,Checkbox,ListView } from 'antd-mobile';
import { createForm } from 'rc-form';

import Api from '../../../api/request';

import Content from '../../../components/Content';
import Footer from '../../../components/Footer';
import ListViewComponent from '../../../components/ListView';

const FlexItem = Flex.Item;
const CheckboxItem = Checkbox.CheckboxItem;

const data = [
    { value: 0, label: 'Ph'},
    { value: 1, label: 'Bachelor'},
    { value: 3, label: 'collegeDiploma1'},
	{ value: 4, label: 'collegeDiploma2'},
	{ value: 5, label: 'collegeDiploma3'},
	{ value: 6, label: 'collegeDiploma4'},
	{ value: 7, label: 'collegeDiploma5'},
	{ value: 8, label: 'collegeDiploma6'},
	{ value: 9, label: 'collegeDiploma7'},
	{ value: 10, label: 'collegeDiploma9'},
];

class MyNewsDetails extends Component {
    constructor(props){
        super(props);
        console.log(props);
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
				readflag:'',
				type:''
			},

			array:[]
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
		return Api.post(this.url,{
			pageNow:1
		})
			.then(res => {
				let dataSource = this.dataSource.cloneWithRows(data);
				console.log(res);
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

		if(totalPageSize < pageNow ){
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

	rowEdit = (i,v) =>{
		let state = i.readflag?'arrow':'';
		return (
			<List className="list-container">
				<CheckboxItem
					key={v}
					onChange={() => this.onChange(i)}
					onClick = { e=>this.open(e) }
					{...this.getFieldProps(i.label,{
						valuePropName:'checked'
					})}
				>
					<div className={`list ${state}`}>
						<div className='list-content'>
							<span className="icon icon-newsDetails"></span>
							<span className="icon icon-newsArrow"></span>
							<p className="title">System message header</p>
							<p className="time">2017.09.08 08:00</p>
							<p className="describe">
								This location displays the content brief of the
								This location displays the content brief of the
							</p>
						</div>
					</div>
				</CheckboxItem>
			</List>
		)
	};

	rowDefault(s,v){
		let state = s.readflag?'arrow':'';
		return (
			<List>
				<div className={`list ${state}`} key={v}>
					<div className='list-content'>
						<span className="icon icon-newsDetails"></span>
						<span className="icon icon-newsArrow"></span>
						<p className="title">System message header</p>
						<p className="time">2017.09.08 08:00</p>
						<p className="describe">This location displays the content brief of the</p>
					</div>
				</div>
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
                <div id="common-header">
                    <div
                        className="back"
                        onClick={this.clickHandle}
                    >
                    </div>
                    <p className="title">NOTICE</p>
                    {/*<div*/}
                        {/*className={`icon ${edit?'icon-complete':'icon-edit'}`}*/}
                        {/*onClick={this.edit}*/}
                    {/*>*/}

                    {/*</div>*/}
                </div>

				<ListViewComponent
					style={!edit?{height:'93vh'}:{height:'85vh'}}
					dataSource={dataSource}
					hasMore={hasMore}
					rollingState={rollingState}
					rows={edit?this.rowEdit:this.rowDefault}
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

MyNewsDetails = createForm()(MyNewsDetails);
export default MyNewsDetails;