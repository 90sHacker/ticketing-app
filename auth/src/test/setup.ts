import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

//create a connection to mongoDB
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
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
  if (mongo) {
    await mongo;
  }
  await mongoose.connection.close();
});