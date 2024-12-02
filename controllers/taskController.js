// controllers/taskController.js
const {Task} = require('../models');

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
    task.isCompleted = isCompleted ?? task.isCompleted;
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

  // Get pagination parameters from query (default: page = 1, pageSize = 10)
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  // Calculate offset
  const offset = (page - 1) * pageSize;

  try {
    // Fetch paginated tasks and total count
    const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
      where: { userId },
      limit: pageSize,
      offset,
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

module.exports = { createTask, getTasks, updateTask, deleteTask };
