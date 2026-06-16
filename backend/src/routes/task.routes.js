const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const {
  getTasks,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler
} = require('../controllers/task.controller');

// All routes protected — must be logged in
router.get('/:projectId', protect, getTasks);
router.post('/', protect, createTaskHandler);
router.put('/:id', protect, updateTaskHandler);
router.delete('/:id', protect, deleteTaskHandler);

module.exports = router;