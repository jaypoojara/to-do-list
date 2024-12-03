// controllers/taskController.js
const {Task} = require('../models');
const { Op } = require('sequelize');

const createTask = async (req, res) => {
  const { title, description, due_date } = req.body;
  const userId = req.userId; // Extracted from JWT token

  try {
    // Create the task
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

const updateTask = async (req, res) => {
  const { id } = req.params; // Task ID from the URL
  const { title, description, isCompleted, due_date } = req.body;
  const userId = req.userId; // Extracted from JWT token

  try {
    // Find the task
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized to update' });
    }

    // Update the task
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.isCompleted = isCompleted ? isCompleted === '1' : task.isCompleted;
    task.due_date = due_date ?? task.due_date; // Update due_date
    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

const getTasks = async (req, res) => {
  const userId = req.userId; // Extracted from JWT token

  // Get pagination and filtering parameters
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const isCompleted = req.query.isCompleted; // Can be 'true', 'false', or 'undefined'
  const search = req.query.search || ''; // Search term for title or description

  // Calculate offset
  const offset = (page - 1) * pageSize;

  try {
    // Build the where clause for filtering
    const whereClause = { userId };
    if (isCompleted !== undefined) {
      whereClause.isCompleted = isCompleted === '1';
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } }, // Case-insensitive search in title
        { description: { [Op.like]: `%${search}%` } }, // Case-insensitive search in description
      ];
    }

    // Fetch filtered and paginated tasks
    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: whereClause,
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']], // Order tasks by creation date
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

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params; // Task ID from the URL
  const userId = req.userId; // Extracted from JWT token

  try {
    // Find the task
    const task = await Task.findOne({ where: { id, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized to delete' });
    }

    // Delete the task
    await task.destroy();

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

const getTaskCounts = async (req, res) => {
  const userId = req.userId; // Extracted from JWT token

  try {
    // Count completed tasks
    const completedCount = await Task.count({
      where: {
        userId,
        isCompleted: true,
      },
    });

    // Count incomplete tasks
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


module.exports = { createTask, getTasks, updateTask, deleteTask, getTaskCounts };
