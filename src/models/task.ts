import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
  body: { type: String, required: true },
  completed: { type: Boolean, required: true },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
