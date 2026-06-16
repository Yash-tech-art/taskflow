const { db } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const findUserByEmail = async (email) => {
  await db.read();
  return db.data.users.find(user => user.email === email);
};

const findUserById = async (id) => {
  await db.read();
  return db.data.users.find(user => user.id === id);
};

const createUser = async ({ name, email, password, role = 'member' }) => {
  await db.read();

  // Hash password before storing — never store plain text passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: uuidv4(),         // unique ID for every user
    name,
    email,
    password: hashedPassword,
    role,                 // 'admin' or 'member'
    createdAt: new Date().toISOString()
  };

  db.data.users.push(newUser);
  await db.write();       // save to db.json file

  // Return user without password — never send password back to client
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const getAllUsers = async () => {
  await db.read();
  return db.data.users.map(({ password, ...rest }) => rest);
};

module.exports = { findUserByEmail, findUserById, createUser, getAllUsers };