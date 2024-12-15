import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io'; // استيراد Socket.IO بالطريقة الصحيحة
import session from 'express-session';
import passport from './src/modules/auth/GoogleAuth.js'; // المسار للموديل الخاص بـ Google Auth
import Appinit from './src/app.router.js'; // المسار للرواتر الأساسي

dotenv.config();
const app = express();

// إعداد الخادم HTTP
const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// إعداد Socket.IO مع CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8081', 'http://exp://192.168.1.239:8081'],  // السماح بالاتصال من هذه النطاقات
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }
});

// تعريف حدث الاتصال مع Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');
    // استماع لحدث 'profileUpdated' الذي يرسل البيانات المحدثة
    socket.on('profileUpdated', (updatedUserData) => {
      console.log('User profile updated:', updatedUserData);
  
      // إرسال التحديثات إلى جميع المتصلين أو متصلين محددين حسب الحاجة
      io.emit('profileUpdated', updatedUserData); // إرسال التحديثات لجميع المتصلين
    });
  
  // أحداث أخرى يمكن إضافتها هنا
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Config Google Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// تهيئة passport
app.use(passport.initialize());

// تهيئة الرواتر
Appinit(app, express);
