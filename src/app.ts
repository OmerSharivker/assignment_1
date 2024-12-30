import express from 'express';
import { dbConnect } from './utils/db';
import bodyParser from 'body-parser';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerConfig';
import cors from 'cors'; // Import the cors package
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("hello");
});

dbConnect();

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', authRoutes);

export default app;


