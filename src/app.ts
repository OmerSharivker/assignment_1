import express from 'express';
import  {dbConnect}  from './utils/db';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
require('dotenv').config();

const app =express();
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("hello")
 })
 dbConnect();


app.use('/api', postRoutes);
app.use('/api', commentRoutes);

export default app;



