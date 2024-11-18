import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Appinit from './src/app.router.js';

dotenv.config();
const app = express()
const PORT = process.env.PORT || 3000;


app.use(cors());

Appinit(app,express);


app.listen(PORT,()=>{
    console.log(`server is running ..... ${PORT}`);
    });

   
