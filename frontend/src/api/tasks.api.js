import API from './axios';

export const getTasks = (projectId) => 
  API.get(`/tasks/${projectId}`);

export const createTask = (taskData) => 
  API.post('/tasks', taskData);

export const updateTask = (id, updates) => 
  API.put(`/tasks/${id}`, updates);

export const deleteTask = (id) => 
  API.delete(`/tasks/${id}`);