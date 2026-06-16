const { db } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const getAllProjects = async (userId) => {
  await db.read();
  // return projects where user is owner or member
  return db.data.projects.filter(p =>
    p.owner === userId || p.members.includes(userId)
  );
};

const getProjectById = async (id) => {
  await db.read();
  return db.data.projects.find(p => p.id === id);
};

const createProject = async ({ name, description, owner }) => {
  await db.read();

  const newProject = {
    id: uuidv4(),
    name,
    description: description || '',
    owner,
    members: [owner], // owner is automatically a member
    createdAt: new Date().toISOString()
  };

  db.data.projects.push(newProject);
  await db.write();
  return newProject;
};

const addMember = async (projectId, userId) => {
  await db.read();

  const index = db.data.projects.findIndex(p => p.id === projectId);
  if (index === -1) return null;

  // avoid duplicate members
  if (!db.data.projects[index].members.includes(userId)) {
    db.data.projects[index].members.push(userId);
    await db.write();
  }

  return db.data.projects[index];
};

module.exports = { getAllProjects, getProjectById, createProject, addMember };