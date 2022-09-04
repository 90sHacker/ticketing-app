import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

//create a connection to mongoDB
let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

//delete all collections before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for(let collection of collections) {
    await collection.deleteMany({});
  }
});

//stop mongo and close mongoose connection
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
})