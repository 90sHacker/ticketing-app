import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { errorHandler } from './middleware/error-handler';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler);

const start = async () => {
  try{
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('connected to db');

  } catch(e) {
    console.log(e);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!');
  }); 
}

start();