import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const dbConnection = {
  url: process.env.DATABASE || '',
  options: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};
