const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const multer = require('multer')
const mammoth = require('mammoth')

let storage = multer.memoryStorage()
let upload = multer({ storage: storage })
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});
app.post('/data/word', upload.single("word"), (req, res) => {
    let file = req.file
    let title = file.originalname  //文件名字
    mammoth.convertToHtml({buffer: file.buffer})
    .then(result => {
        res.send({
            status: 200,
            data: result,
            title
        })
    })
    .done(err => {
        res.send({
            status: 500,
            data: 'error',
            title: 'error'
        })
    });
})


app.listen(5000, ()=>{
    console.log('http://127.0.0.1:5000')
}) 