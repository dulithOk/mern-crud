const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postRouter = require('./routes/post');
const cors = require('cors');

const app = express();

//convert jason to javascript object
app.use(bodyParser.json());

app.use(postRouter);
app.use(cors(

    {
        origin: 'http://localhost:3000'
        
    }
));




const port = 8000;

const DB_URL = 'mongodb+srv://dahanayakad22:qqhtLTV26R5rUesu@cluster0.aydwu7d.mongodb.net/okCrud?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(DB_URL)
.then(()=>{
    console.log('DB Connect');

})
.catch((err)=>{
    console.log('connect failed',err);

})

app.listen(port, ()=>{

    console.log('the server is running ${port}');


});