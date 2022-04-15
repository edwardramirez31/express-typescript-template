import { Request, Response } from 'express';
import Task from '../models/task';

type Handler = (req: Request, res: Response) => void;

export const getTasks: Handler = async (_req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
};

export const createTask: Handler = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(200).json(task);
};

export const updateTask: Handler = async (req, res) => {
  const { id } = req.params;
  const doc = await Task.findById(id);
  doc.body = req.body.body;
  doc.completed = req.body.completed;
  await doc.save();
  res.status(200).json(doc);
};

export const deleteTask: Handler = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndRemove(id);
  res.status(200).json(task);
};
