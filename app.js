const express =require("express");
const { dbConnect } = require("./utils/db");
require('dotenv').config();


const app =express();
const port =process.env.PORT;

app.get('/',(req,res)=>{
    res.send("hello")
 })
 
 dbConnect();

app.listen(port, () =>{
    console.log(`server is running on port ${port}`)
})

app.use('/api', require('./routes/postRoutes.js'));
