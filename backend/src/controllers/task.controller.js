const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../models/Task.model');
const { getProjectById } = require('../models/Project.model');
const { getIO } = require('../socket/socket');

// GET /api/tasks/:projectId
const getTasks = async (req, res) => {
  try {
    const tasks = await getAllTasks(req.params.projectId);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks
const createTaskHandler = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, deadline } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    const task = await createTask({
      title,
      description,
      projectId,
      assignedTo,
      deadline,
      createdBy: req.user.id
    });

    // emit real time event to everyone in the project room
    getIO().to(projectId).emit('task:created', task);

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id
const updateTaskHandler = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await updateTask(req.params.id, req.body);

    // emit real time event — everyone in the room sees the update instantly
    getIO().to(task.projectId).emit('task:updated', updatedTask);

    res.json({ task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTaskHandler = async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // only admin or task creator can delete
    if (req.user.role !== 'admin' && task.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await deleteTask(req.params.id);

    // emit real time event
    getIO().to(task.projectId).emit('task:deleted', { id: req.params.id });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTaskHandler, updateTaskHandler, deleteTaskHandler };