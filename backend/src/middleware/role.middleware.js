// This middleware checks if user has required role
// Usage: router.delete('/project', protect, adminOnly, deleteProject)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — admins only' });
  }
};

module.exports = { adminOnly };