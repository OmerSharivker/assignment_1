const express =require("express");
const { dbConnect } = require("./utils/db");
const  bodyParser =require('body-parser')
require('dotenv').config();

const app =express();
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("hello")
 })
 dbConnect();
 app.use('/api', require('./routes/postRoutes.js'));

 module.exports=app