const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const {
  getProjects,
  createProjectHandler,
  getProjectHandler,
  addMemberHandler
} = require('../controllers/project.controller');

// GET all projects for logged in user
router.get('/', protect, getProjects);

// POST create new project — admin only
router.post('/', protect, adminOnly, createProjectHandler);

// GET single project
router.get('/:id', protect, getProjectHandler);

// POST add member to project — admin only
router.post('/:id/members', protect, adminOnly, addMemberHandler);

module.exports = router;