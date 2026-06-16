const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getAllUsers } = require('../models/user.model');

// GET /api/users — get all users (for task assignment dropdown)
router.get('/', protect, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;