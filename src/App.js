import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import img from './img/test.jpg'
import 'antd/dist/antd.css';
import { Icon, Spin, Divider } from 'antd'
import classnames from 'classnames'
//import InlineEditor from '@ckeditor/ckeditor5-build-inline/build/ckeditor.js'
//import '@ckeditor/ckeditor5-build-inline/build/translations/zh-cn'
import InlineEditor from './ckeditor5-build-inline/build/ckeditor'
import './ckeditor5-build-inline/build/translations/zh-cn'
import UpLoader from './component/uploader';
class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			list: [
				'Head',
				'Text',
				'Img',
				'block'
			],
			editors: [],
			dividerPosition: -1, //0 - editors.length
		}
		this.editors = []
		this.datas = []
		this.timer = 300
		this.type = null  //判断当前加载的是什么类型的编辑器
		this.dragStart = this.dragStart.bind(this)
		this.dragEnter = this.dragEnter.bind(this)
		this.dragLeave = this.dragLeave.bind(this)
		this.drop = this.drop.bind(this)
		this.dragOver = this.dragOver.bind(this)
		this.createData = this.createData.bind(this)
		this.changeReady = this.changeReady.bind(this)
		this.del = this.del.bind(this)
		this.itemShow = this.itemShow.bind(this)
		this.itemHidden = this.itemHidden.bind(this)
		this.formatEditors = this.formatEditors.bind(this)
		this.addDivider = this.addDivider.bind(this)
		this.delDivider = this.delDivider.bind(this)
		this.saveData = this.saveData.bind(this)
	}
  	render() {
		return (
			<div className="app">
				<div
				className="left" style={{
					width: '800px',
					minHeight: '900px',
					float: 'left',
					background: '#000',
					padding: '25px 0',
					boxSizing: 'border-box'
				}}>
					<div
					onDragLeave={e => this.dragLeave(e)}
					onDrop={e => this.drop(e)}
					onDragEnter={e => this.dragEnter(e)}
					onDragOver={e => this.dragOver(e)}
					style={{
						width: '90%',
						minHeight: '900px',
						margin: '0 auto',
						background: '#fff',
						boxSizing: 'border-box',
						padding: '30px 40px'
					}}>
						{
							this.state.editors.map((v, i) => {
								return (
									<div key={i + "d"}>
										{
											this.state.dividerPosition === i && <Divider key={i + "d"}>here?</Divider>
										}
										<div key={i} className="editorWrapper">
											<div className={classnames({
													show: v.isReady,
													editorContainer: true
												})} ref={'wrapper' + i}>
												<div className="iconLeft" style={{
													height: '21px',
													width: '21px'
												}}>
													<Icon type="menu" />
												</div>
												<CKEditor
													data-index={i}
													config = {{
														placeholder:'Text here',
														language: 'zh-cn',
														toolbar: [
															'|',
															'bold',
															'italic',
															'link',
															'bulletedList',
															'numberedList',
															'fontcolor',
															'fontbackgroundcolor',
															'imageUpload',
															'alignment',
															'insertTable',
															'mediaEmbed',
															'undo',
															'redo'
														]
													}}
													key={i}
													editor={ v.editor }
													data = {v.data}
													onInit = {editor => {
														setTimeout(() => {
															this.changeReady(i)
														},200)
													}}
													onChange = {(event, editor) => {
														this.saveData(i, editor)
													}}
												></CKEditor>
												<div className="iconRight" style={{
													textAlign: 'center',
													fontSize: '14px',
													marginLeft: '5px',
													cursor: 'pointer',
													height: '21px'
												}} data-index={i} onMouseOver={e => this.itemShow(e)}
												onMouseOut={e => this.itemHidden(e)}
												>
													<Icon type="more" />
													<div className={classnames({
														item: true,
														itemShow: v.sideTool
													})} style={{
														width: '50px',
														paddingTop: '10px',
														background: '#f5f5f5'
													}}>
														{
															v.itemList.map((V, I) => {
																if(I === 0) {
																	return <p key={I} style={{
																		margin: 0,
																		lineHeight: '40px'
																	}} data-index={i}>{V}</p>
																} else if(I === 1) {
																	return <p key={I} style={{
																		color: '#3385ff',
																		margin: 0,
																		lineHeight: '40px'
																	}} data-index={i}>{V}</p>
																} else {
																	return <p key={I} style={{
																		color: '#f40',
																		margin: 0,
																		lineHeight: '40px'
																	}} data-index={i} onClick={(e) => this.del(e)}>{V}</p>
																}
															})
														}
													</div>
												</div>
											</div>
											<div style={{
												textAlign: 'center'
											}} className={classnames({
												show: !v.isReady
											})}>
												<Spin />
											</div>
										</div>
									</div>
								)
							})

						}
						{
							this.state.dividerPosition === this.state.editors.length && <Divider>here?</Divider>
						}
					</div>
				</div>
				<ul className="right" style={{
					width: '200px',
					float: 'right',
					padding: '0'
				}}>
					{
						this.state.list.map((v, i) => (
							<li key={i} draggable={true} onDragStart={e => this.dragStart(e)} className="list" style={{
								listStyle: 'none',
								width: '82px',
								height: '64px',
								float: 'left',
								lineHeight: '64px',
								textAlign: 'center',
								margin: '5px',
								background: '#f4f4f4',
								border:'1px solid #e5e5e5',
								color: '#000',
								cursor: 'move',
							}}>{v}</li>
						))
					}
					<UpLoader></UpLoader>
				</ul>	
			</div>
		)
	}

	//开始拖动时触发
	dragStart(e) {
		e.persist()
		this.type = e.currentTarget.innerHTML
	}
	//进入目标区域触发
	dragEnter(e) {
		e.preventDefault()
		
	}
	//移除目标区域
	dragLeave(e) {
		/*e.stopPropagation()
		this.setState({
			dividerPosition: -1
		})*/
	}
	//落到目标区域触发
	drop(e) {
		this.updateDividerPosition(e)

		let itemList = ['复制', '收藏', '删除']
		let type = this.type
		let data = this.createData(type)
		let obj = {
			editor: InlineEditor,
			isReady: false,
			data,
			itemList,
			sideTool: false,
			wrapperDom: null,
			sumHeight: 0,
			type: 'editor'
		}
		let editors = this.state.editors
		
		let dividerPosition = this.state.dividerPosition
		editors.splice(dividerPosition, 0, obj)
		this.datas.splice(dividerPosition, 0, data)
		editors = editors.map((v, i) => {
			v.data = this.datas[i]
			return v
		})
		this.setState({
			editors,
			dividerPosition: -1
		})
	}
	//悬停区域触发
	dragOver(e) {
		e.preventDefault()

		if(this.timer < 25) return this.timer+=5
		this.timer = 0
		this.updateDividerPosition(e)

	}
	updateDividerPosition(e){
		let currentPositon = this.state.dividerPosition
		let nextPositon
		if(this.state.editors.length === 0) {
			// this.addDivider(0)
			nextPositon = 0
		} else {
			//第一个
			
			for(let i = 0; i < this.state.editors.length; i++){
				let v = this.state.editors[i]
				if(v === 1) return

				let dom = this.refs["wrapper" + i]
				let rect = dom.getBoundingClientRect()
				let mid = rect.top + rect.height / 2

				if(e.clientY <= mid) {
					nextPositon = i
					break
				} else if(i === this.state.editors.length - 1){
					nextPositon = this.state.editors.length
				}
			}
		}

		if(nextPositon !== currentPositon){
			this.setState({
				dividerPosition:nextPositon
			})
		}
	}

	createData(type) {
		let list = this.state.list
		let ans = ''
		if(type === list[0]) {
			ans = '<h2></h2>'
		} else if(type === list[1]) {
			ans = '<p></p>'
		} else if(type === list[2]) {
			ans = `<img src=${img}></img>`
		} else if(type === list[3]) {
			ans = '<blockquote><p></p></blockquote>'
		}
		this.datas.push(ans)
		return ans
	}

	changeReady(i) {
		let that = this
		let editors = [...that.state.editors]
		editors.forEach(v => {
			if(v.isReady === false) {
				v.isReady = true
			}
		})
		that.setState({
			editors
		})
	}

	del(e) {
		e.stopPropagation()
		let index = parseInt(e.target.getAttribute('data-index'))
		let editors = [...this.state.editors]
		editors.splice(index, 1)
		this.datas.splice(index, 1)
		this.setState({
			editors
		})
	}

	itemHidden(e) {
		let index = parseInt(e.currentTarget.getAttribute('data-index'))
		let editors = [...this.state.editors]
		editors[index].sideTool = false
		this.setState({
			editors
		})
	}

	itemShow(e) {
		let index = parseInt(e.currentTarget.getAttribute('data-index'))
		let editors = [...this.state.editors]
		editors[index].sideTool = true
		this.setState({
			editors
		})
	}

	addDivider(i) {
		let editors = this.state.editors
		if(editors.includes(1)) {
			let index = editors.indexOf(1)
			editors.splice(index, 1)
			editors.splice(i, 0, 1)
		} else {
			if(i === 'max') {
				editors.push(1)
			} else {
				editors.splice(i, 0, 1)
			}
		}
		this.setState({
			editors
		})
	}

	delDivider(editors, obj) {
		return this.formatEditors(editors, obj)
	}

	formatEditors(editors, obj) {
		if(editors.indexOf(1) !== -1) {
			if(obj) {
				editors.splice(editors.indexOf(1), 1, obj)
			} else {
				editors.splice(editors.indexOf(1), 1)
			}
		}
		return editors
	}
	saveData(i, editor) {
		this.datas[i] = editor.getData()
	}
}

export default App;
