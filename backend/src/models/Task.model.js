const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getAllTasks = async (projectId) => {
  await db.read();
  return db.data.tasks.filter(task => task.projectId === projectId);
};

const getTaskById = async (id) => {
  await db.read();
  return db.data.tasks.find(task => task.id === id);
};

const createTask = async ({ title, description, projectId, assignedTo, deadline, createdBy }) => {
  await db.read();

  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'todo',        // todo, inprogress, done
    projectId,
    assignedTo: assignedTo || null,
    deadline: deadline || null,
    createdBy,
    createdAt: new Date().toISOString()
  };

  db.data.tasks.push(newTask);
  await db.write();
  return newTask;
};

const updateTask = async (id, updates) => {
  await db.read();

  const index = db.data.tasks.findIndex(task => task.id === id);
  if (index === -1) return null;

  // merge existing task with updates
  db.data.tasks[index] = { ...db.data.tasks[index], ...updates };
  await db.write();
  return db.data.tasks[index];
};

const deleteTask = async (id) => {
  await db.read();

  const index = db.data.tasks.findIndex(task => task.id === id);
  if (index === -1) return false;

  db.data.tasks.splice(index, 1);
  await db.write();
  return true;
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };