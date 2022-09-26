import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  try{
    if(!process.env.JWT_KEY) {
      throw new Error('jwt key not defined');
    }

    if(!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to db');

  } catch(e) {
    console.log(e);
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!');
  }); 
}

start();