import './index.less';

import React,{Component} from 'react';

import UploadPictures from '../../utils/UploadPictures';

class PhonePhoto extends Component {
	constructor(props){
		super(props);

		this.state = {
			files:[],
		};

		this.name = 0;

	};

	componentWillUnmount(){
		this.setState = () => {};
	};

	onImageClick = () => {
		const { files } = this.state;

		let name = this.name++ ;

		if ( window.plus ) {

			UploadPictures.Pictures(pa=>{
				let path = '';
				path = pa;

				files.push({name,src:pa});


				this.callback(files);

			});

		} else {
			files.push({name,src:'1'});
			this.callback(files);
		};

	};

	callback = (files) => {
		this.setState({
			files
		},() => this.props.fn(files));
	};

	delete = (e,index) => {
		//console.log('点击');
		e.preventDefault();
		const { files } = this.state;
		//console.log(files,files.length,index);
		files.splice(index,1);

		//console.log(files,files.length);

		this.setState({
			files
		},() => this.props.fn(files))
	};

	render(){
		const { files } = this.state;
		//console.log(files);
		return (
			<div className="uploadPictures">
				<ul>
					{
						files.map((s,v)=>
							<li
								key={v}
							>
                                <span
                                    className="icon icon-listDelete"
                                    onClick={ (e) => this.delete(e,v)}
                                >

                                </span>
								<img src={s.src} alt={s.name}/>
							</li>
						)
					}
					<li
						className="add-Photo"
						onClick={this.onImageClick}
					>
                        <span className="icon icon-photo">

                        </span>
						<p>PHOTOS</p>
					</li>
				</ul>
			</div>
		)
	}
};

export default PhonePhoto;