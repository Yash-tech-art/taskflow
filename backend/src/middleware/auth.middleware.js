const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/User.model');

const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    // Header looks like: "Bearer eyJhbGc..."
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, access denied' });
    }

    // Extract just the token part after "Bearer "
    const token = authHeader.split(' ')[1];

    // Verify token — this throws an error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from decoded token id
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request object so controllers can use it
    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next(); // move to next middleware or controller
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { protect };