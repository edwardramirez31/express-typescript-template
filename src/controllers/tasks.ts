import Handler from '../types/api';
import Task from '../models/task';

export const getTasks: Handler = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(401);
  }
  const tasks = await Task.find({ createdBy: user._id });
  return res.status(200).json(tasks);
};

export const createTask: Handler = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res.status(401);
  }
  const { body, completed } = req.body;

  const task = await Task.create({ body, completed, createdBy: user._id });
  return res.status(200).json(task);
};

export const updateTask: Handler = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const doc = await Task.findById(id);
  if (!doc) {
    return res.status(400).json({ message: 'task does not exist' });
  }
  if (doc.createdBy.toString() !== user?._id.toString()) {
    return res.status(401).json({ message: 'you can"t access this resource' });
  }
  doc.body = req.body.body;
  doc.completed = req.body.completed;
  await doc.save();
  return res.status(200).json(doc);
};

export const deleteTask: Handler = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return res.status(400).json({ message: 'task does not exist' });
  }
  if (task.createdBy.toString() !== user?._id.toString()) {
    return res.status(401).json({ message: 'you can"t access this resource' });
  }
  await task.remove();
  return res.status(200).json(task);
};
