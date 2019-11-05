import React from 'react'

function loaderFile(e) {
    let target = e.target
    if(target.files.length === 0) return 
    let file = target.files[0]
    let fileName = file.name
    if(/doc(x)$/.test(fileName)) {  //如果是word文档
        console.log(file)
    }
}

const UpLoader = (props) => {
    return (
        <div style={{
            textAlign: 'center',
            marginTop: '180px'
        }}>
            <input type='file' onChange={e => loaderFile(e)}></input>
        </div>
    )
}

export default UpLoader