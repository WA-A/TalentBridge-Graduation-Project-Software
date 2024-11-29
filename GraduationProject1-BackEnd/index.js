import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Appinit from './src/app.router.js';
import session from 'express-session';
import passport from './src/modules/Auth/GoogleAuth.js';

dotenv.config();
const app = express();

// إضافة هذه السطر قبل أي شيء آخر لتمكين معالجة JSON
app.use(express.json()); // هذا يسمح للخادم بمعالجة JSON في الجسم

// إعداد CORS مع دعم التطبيقات الموبايل والويب
const allowedOrigins = ['http://localhost:8081', 'http://exp://192.168.1.239:8081'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// معالجة طلبات preflight تلقائيًا
app.options('*', cors(corsOptions));

// إعداد Middleware لإضافة ترويسات (Headers) بشكل صريح
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Config Google Session
app.use(session({
  secret: process.env.SESSION_SECRET ,
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());

// تهيئة الرواتر
Appinit(app, express);

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});