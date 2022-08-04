import express from 'express';
import 'express-async-errors';
import 'colors';
import 'dotenv/config';
import { connectDB } from './db/connectDB';
import { authRouter, postsRouter } from './routes';
import { notFound, errors, auth } from './middleware';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/posts', auth, postsRouter);

app.use(errors);
app.use(notFound);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`.cyan.underline.bold);
    });
  } catch (error) {
    console.log(`${error}`.red.underline.bold);
  }
};

start();
