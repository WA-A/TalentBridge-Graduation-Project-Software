import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Appinit from './src/app.router.js';

dotenv.config();
const app = express();

// إعداد CORS
const corsOptions = {
  origin: 'http://localhost:8081',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  res.header('Access-Control-Allow-Credentials', 'true'); 
  next();
});


Appinit(app, express);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
