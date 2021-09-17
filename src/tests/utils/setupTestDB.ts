import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

// Connect DB
export const connectToDB = async () => {
  const uri = process.env.DATABASE || '';
  const mongooseOps = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, mongooseOps);
};

// Disconnect and close connection
export const closeDB = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

// Clear the DB, remove all data
export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};
