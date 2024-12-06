import db from '../models/index.js';

const Task = db.Task;

/**
 * Fetch tasks for a user with optional filters and pagination.
 * @param {Object} options - Filtering and pagination options.
 * @returns {Object} - Paginated tasks and total count.
 */
export const getTasks = async ({ userId, page, pageSize, isCompleted, search }) => {
  const offset = (page - 1) * pageSize;

  // Build the where clause for filters
  const whereClause = { userId };
  if (isCompleted !== undefined) {
    whereClause.isCompleted = isCompleted;
  }
  if (search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: tasks, count: totalTasks } = await Task.findAndCountAll({
    where: whereClause,
    limit: pageSize,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return { tasks, totalTasks };
};

/**
 * Create a new task.
 * @param {Object} taskData - The data for the new task.
 * @returns {Object} - The created task.
 */
export const createTask = async (taskData) => {
  return await Task.create(taskData);
};

/**
 * Update a task by ID for a specific user.
 * @param {Number} id - Task ID.
 * @param {Number} userId - User ID.
 * @param {Object} updates - Fields to update.
 * @returns {Object} - The updated task or null if not found.
 */
export const updateTask = async (id, userId, updates) => {
  const task = await Task.findOne({ where: { id, userId } });

  if (!task) {
    return null;
  }

  Object.assign(task, updates);
  await task.save();
  return task;
};

/**
 * Delete a task by ID for a specific user.
 * @param {Number} id - Task ID.
 * @param {Number} userId - User ID.
 * @returns {Boolean} - Whether the task was deleted.
 */
export const deleteTask = async (id, userId) => {
  const task = await Task.findOne({ where: { id, userId } });

  if (!task) {
    return false;
  }

  await task.destroy();
  return true;
};

/**
 * Get counts of completed and incomplete tasks for a user.
 * @param {Number} userId - User ID.
 * @returns {Object} - Counts of completed and incomplete tasks.
 */
export const getTaskCounts = async (userId) => {
  const completedCount = await Task.count({ where: { userId, isCompleted: true } });
  const incompleteCount = await Task.count({ where: { userId, isCompleted: false } });

  return { completed: completedCount, incomplete: incompleteCount };
};
