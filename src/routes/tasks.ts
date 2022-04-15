import express = require('express');
import tasksControllers = require('../controllers/tasks');

// eslint-disable-next-line object-curly-newline
const { getTasks, createTask, updateTask, deleteTask } = tasksControllers;

const router = express.Router();

router.route('/').get(getTasks).post(createTask);
router.route('/:id').delete(deleteTask).put(updateTask);

export default router;
