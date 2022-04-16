import express from 'express';
import authMiddleware from '../middleware/auth';
// eslint-disable-next-line object-curly-newline
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/tasks';

const router = express.Router();

router.use(authMiddleware);

router.route('/').get(getTasks).post(createTask);
router.route('/:id').delete(deleteTask).put(updateTask);

export default router;
