/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import taskRouter from './routes/tasks';

async function startMongo() {
  try {
    await mongoose.connect('mongodb://admin:password@db:27017/todo?authSource=admin');
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

const port = 5000;
app.get('/', (_, res) => {
  res.status(200).send('<h1>Here</h1>');
});

app.listen(port, () => console.log(`Running on port ${port}`));
