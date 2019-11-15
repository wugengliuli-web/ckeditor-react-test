import React from 'react'
import { Upload, Icon, message } from 'antd';
import axios from 'axios'

const { Dragger } = Upload

const UpLoader = ({setWordData}) => {
    const props = {
        name: 'word',
        action: '',
        showUploadList: false,
        beforeUpload(file) {
            let name = file.name
            if(/doc(x)$/.test(name)) return true
            else {
                message.error('只支持上传word')
                return false
            }
        },
        customRequest(info) {
            console.time('上传')
            let fd = new FormData()
            fd.append('word', info.file)
            axios.post('http://localhost:5000/data/word', fd).then(res => {
                let { status, data, title } = res.data
                if(status === 200) {
                    let val = data.value
                    title = title.slice(0, -5)
                    let reg = new RegExp(/(<ul>(.*?)<\/ul>)|(<ol>(.*?)<\/ol>)|(<p>(.*?)<\/p>)|(<table>(.*?)<\/table>)|(<h([1-6])>(.*?)<\/h([1-6])>)|(<img.*?\/>)/gim)
                    let arr = val.match(reg)
                    setWordData({title, arr})
                    message.success(`上传成功`);
                    console.timeEnd('上传')
                } else {
                    message.success(`上传失败`);
                }
            })
        },
        onChange(info) {
            const { status } = info.file
            if (status !== 'uploading') {
                
            }
            if (status === 'done') {
                message.success(`上传成功`);
            } else if (status === 'error') {
                message.error(`上传失败`);
            }
        }
    }
    
    return (
        <div style={{
            textAlign: 'center',
            marginTop: '30px',
            marginRight: '20px'
        }}>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或者拖动文件到此处</p>
            </Dragger>
        </div>
    )
}

export default UpLoader