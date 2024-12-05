import db from '../models/index.js';
import { Op } from 'sequelize';

const { Task } = db;

export const createTask = async (req, res) => {
  const { title, description, due_date } = req.body;
  const userId = req.userId;

  try {
    const newTask = await Task.create({
      userId,
      title,
      description,
      isCompleted: false,
      due_date,
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, isCompleted, due_date } = req.body;
  const userId = req.userId;

  try {
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized to update' });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.isCompleted = isCompleted ? isCompleted === '1' : task.isCompleted;
    task.due_date = due_date ?? task.due_date;
    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  const userId = req.userId;

  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const isCompleted = req.query.isCompleted;
  const search = req.query.search || '';

  const offset = (page - 1) * pageSize;

  try {
    const whereClause = { userId };
    if (isCompleted !== undefined) {
      whereClause.isCompleted = isCompleted === '1';
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
      pagination: {
        currentPage: page,
        pageSize,
        totalTasks,
        totalPages: Math.ceil(totalTasks / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized to delete' });
    }

    await task.destroy();

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

export const getTaskCounts = async (req, res) => {
  const userId = req.userId;

  try {
    const completedCount = await Task.count({
      where: {
        userId,
        isCompleted: true,
      },
    });

    const incompleteCount = await Task.count({
      where: {
        userId,
        isCompleted: false,
      },
    });

    res.status(200).json({
      message: 'Task counts retrieved successfully',
      counts: {
        completed: completedCount,
        incomplete: incompleteCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving task counts', error: error.message });
  }
};
