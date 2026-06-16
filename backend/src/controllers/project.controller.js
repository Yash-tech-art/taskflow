const { getAllProjects, getProjectById, createProject, addMember } = require('../models/Project.model');

// GET /api/projects — get all projects for logged in user
const getProjects = async (req, res) => {
  try {
    const projects = await getAllProjects(req.user.id);
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects — create new project (admin only)
const createProjectHandler = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await createProject({
      name,
      description,
      owner: req.user.id
    });

    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/projects/:id — get single project
const getProjectHandler = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // check if user is a member of this project
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects/:id/members — add member to project (admin only)
const addMemberHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const project = await getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // only project owner can add members
    if (project.owner !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    const updatedProject = await addMember(req.params.id, userId);
    res.json({ project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProjectHandler, getProjectHandler, addMemberHandler };