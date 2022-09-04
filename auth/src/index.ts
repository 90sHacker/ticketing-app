import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  try{
    if(!process.env.JWT_KEY) {
      throw new Error('jwt key not defined');
    }
    
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