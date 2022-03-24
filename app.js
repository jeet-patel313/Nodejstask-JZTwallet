import express, { json } from 'express';
const app = express();
import pkg from 'body-parser';
const { json: _json } = pkg;
import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

//Routes import
import authRoute from './routes/auth.js';
import adminRoute from './routes/admin.js';
import transferRoute from './routes/transfer.js';

//Middlewares
app.use(json());
app.use(_json());

//route middlewares
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/transfer', transferRoute);

//DB connection
mongoose.connect(
  process.env.DB_CONNECT,
  () => {
    console.log('Connected to DB');
  }
);

app.listen(3000);