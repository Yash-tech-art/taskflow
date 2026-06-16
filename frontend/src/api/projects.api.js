import API from './axios';

export const getProjects = () => 
  API.get('/projects');

export const createProject = (data) => 
  API.post('/projects', data);

export const getProject = (id) => 
  API.get(`/projects/${id}`);

export const addMember = (projectId, userId) =>
  API.post(`/projects/${projectId}/members`, { userId });