/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRouter from './routes/tasks';
import authRouter from './routes/auth';

dotenv.config();

async function startMongo() {
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_USER ?? 'user'}:${
        process.env.DB_PASSWORD ?? 'pass'
      }@db:27017/todo?authSource=admin`
    );
    console.log('MONGO CONNECTED');
  } catch (error) {
    console.log(error);
  }
}
startMongo();

const app = express();
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// routers
app.use('/api/v1/task', taskRouter);
app.use('/api/v1/auth', authRouter);

const port = 5000;
app.get('/', (_, res) => {
  res.status(200).send('<h1>Here</h1>');
});

app.listen(port, () => console.log(`Running on port ${port}`));
