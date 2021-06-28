import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const DB = process.env.DATABASE || '';

export const dbConnection = {
  url: DB,
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};
