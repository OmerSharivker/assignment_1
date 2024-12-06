import express from 'express';
import  {dbConnect}  from './utils/db';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';
require('dotenv').config();

const app =express();
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send("hello")
 })
 dbConnect();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api',  authRoutes);

export default app;



