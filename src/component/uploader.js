import React from 'react'
import mammoth from '../lib/mammoth.browser'



const UpLoader = ({setWordData}) => {
    function loaderFile(e) {
        let target = e.target
        if(target.files.length === 0) return 
        let file = target.files[0]
        let fileName = file.name
        if(/doc(x)$/.test(fileName)) {  //如果是word文档
            readFileInputEventAsArrayBuffer(e, function(arrayBuffer) {
                mammoth.convertToHtml({arrayBuffer: arrayBuffer})
                    .then(result => {
                        setWordData(result.value)
                        target.value = ''
                    })
                    .done();
            })
        }
    }
    
    function readFileInputEventAsArrayBuffer(event, callback) {
        var file = event.target.files[0];
    
        var reader = new FileReader();
        
        reader.onload = function(loadEvent) {
            var arrayBuffer = loadEvent.target.result;
            callback(arrayBuffer);
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    
    function escapeHtml(value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    
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