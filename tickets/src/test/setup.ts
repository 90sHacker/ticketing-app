import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

//augment global variable with signin function
declare global {
  var signin: () => string[]
}

//fake connection to NATS server
jest.mock('../nats-wrapper');

//create a connection to mongoDB
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

//delete all collections before each test
beforeEach(async () => {
  jest.clearAllMocks();
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

global.signin = () => {
  //build a JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'tester@test.com'
  };
  //create the JWT token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object {jwt: MY_JWT}
  const session = { jwt: token};

  //turn session into JSON
  const sessionJSON = JSON.stringify(session);

  //encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return cookie with the encoded data as string
  return [`session=${base64}`];
}