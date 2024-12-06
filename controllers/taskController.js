import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskCounts,
} from '../services/taskService.js';

export const fetchTasks = async (req, res) => {
  const { page = 1, pageSize = 10, isCompleted, search } = req.query;

  try {
    const { tasks, totalTasks } = await getTasks({
      userId: req.userId,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      isCompleted: isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined,
      search,
    });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
      pagination: {
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
        totalTasks,
        totalPages: Math.ceil(totalTasks / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
  }
};

export const addTask = async (req, res) => {
  const { title, description, due_date } = req.body;

  try {
    const newTask = await createTask({
      userId: req.userId,
      title,
      description,
      due_date,
      isCompleted: false,
    });

    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const modifyTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTask = await updateTask(id, req.userId, updates);

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized to update' });
    }

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

export const removeTask = async (req, res) => {
  const { id } = req.params;

  try {
    const success = await deleteTask(id, req.userId);

    if (!success) {
      return res.status(404).json({ message: 'Task not found or not authorized to delete' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

export const fetchTaskCounts = async (req, res) => {
  try {
    const counts = await getTaskCounts(req.userId);
    res.status(200).json({ message: 'Task counts retrieved successfully', counts });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving task counts', error: error.message });
  }
};
