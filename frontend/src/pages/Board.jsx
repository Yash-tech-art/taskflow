import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks.api';
import { getProject } from '../api/projects.api';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';

// Column definitions — todo, inprogress, done
const COLUMNS = [
  { id: 'todo', title: '📋 To Do', color: 'bg-gray-100' },
  { id: 'inprogress', title: '⚡ In Progress', color: 'bg-blue-50' },
  { id: 'done', title: '✅ Done', color: 'bg-green-50' },
];

const Board = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: ''
  });
  const [creating, setCreating] = useState(false);

  // Fetch project and tasks when component loads
  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Socket.io real time updates
  useEffect(() => {
    if (!socket) return;

    // Join the project room
    socket.emit('join_project', projectId);

    // Listen for real time task events
    socket.on('task:created', (newTask) => {
      setTasks(prev => [...prev, newTask]);
    });

    socket.on('task:updated', (updatedTask) => {
      setTasks(prev =>
        prev.map(t => t.id === updatedTask.id ? updatedTask : t)
      );
    });

    socket.on('task:deleted', ({ id }) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    });

    // Cleanup listeners when component unmounts
    return () => {
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, [socket, projectId]);

  const fetchData = async () => {
    try {
      const [tasksRes, projectRes] = await Promise.all([
        getTasks(projectId),
        getProject(projectId)
      ]);
      setTasks(tasksRes.data.tasks);
      setProject(projectRes.data.project);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks by status for each column
  const getColumnTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Handle drag and drop
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a column
    if (!destination) return;

    // Dropped in same position
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;

    // Optimistic update — update UI immediately without waiting for API
    setTasks(prev =>
      prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t)
    );

    try {
      await updateTask(draggableId, { status: newStatus });
    } catch (err) {
      console.error('Error updating task:', err);
      // Revert if API call fails
      fetchData();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await createTask({ ...formData, projectId });
      setShowModal(false);
      setFormData({ title: '', description: '', deadline: '', assignedTo: '' });
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-400 text-lg">Loading board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project?.name}
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {project?.description}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition duration-200"
          >
            + Add Task
          </button>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.id} className={`${column.color} rounded-xl p-4`}>

                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-700">
                    {column.title}
                  </h2>
                  <span className="bg-white text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
                    {getColumnTasks(column.id).length}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-32 space-y-3 transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-blue-100 rounded-lg p-2' : ''
                      }`}
                    >
                      {getColumnTasks(column.id).map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing transition-shadow duration-200 ${
                                snapshot.isDragging ? 'shadow-lg rotate-1' : ''
                              }`}
                            >
                              {/* Task title */}
                              <h3 className="font-medium text-gray-900 text-sm">
                                {task.title}
                              </h3>

                              {/* Task description */}
                              {task.description && (
                                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              {/* Deadline */}
                              {task.deadline && (
                                <div className="flex items-center gap-1 mt-2">
                                  <span className="text-xs text-orange-500">
                                    📅 {new Date(task.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between mt-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  task.status === 'todo'
                                    ? 'bg-gray-100 text-gray-600'
                                    : task.status === 'inprogress'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                  {task.status === 'inprogress' ? 'In Progress' : task.status}
                                </span>

                                {/* Delete button — admin or task creator */}
                                {(user?.role === 'admin' || task.createdBy === user?.id) && (
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-red-400 hover:text-red-600 text-xs transition"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Add New Task
            </h2>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Design login page"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition duration-200 disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;