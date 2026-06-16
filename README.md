TaskFlow — Team Productivity App

A full-stack team productivity application built with the MERN stack, designed for small teams to collaborate in real time using a Kanban board interface.

🚀 Live Demo


Frontend: https://taskflow-xxx.vercel.app
Backend API: https://taskflow-backend-euzz.onrender.com



Note: Backend is hosted on Render's free tier — first request may take 2-3 minutes to wake up.




✨ Features


🔐 JWT Authentication — Secure login and register with token-based auth
👥 Role-Based Access Control — Admin and Member roles with different permissions
📋 Kanban Board — Visual task management with 3 columns (To Do, In Progress, Done)
🖱️ Drag and Drop — Move tasks between columns with smooth drag and drop
⚡ Real-Time Updates — Instant task updates via WebSockets (Socket.io)
📱 Responsive UI — Works on mobile, tablet, and desktop
🗂️ Project Management — Create and manage multiple projects



🛠️ Tech Stack

Frontend

TechnologyPurposeReact.jsUI component libraryViteBuild tool and dev serverTailwind CSSUtility-first stylingAxiosHTTP requests to backendReact Router DOMClient-side routingSocket.io ClientReal-time WebSocket connection@hello-pangea/dndDrag and drop Kanban board

Backend

TechnologyPurposeNode.jsJavaScript runtimeExpress.jsWeb framework and REST APISocket.ioReal-time WebSocket serverJWT (jsonwebtoken)Token-based authenticationbcryptjsPassword hashinglowdbJSON file databaseuuidUnique ID generationdotenvEnvironment variable management

Deployment

ServicePurposeVercelFrontend hostingRenderBackend hostingGitHubVersion control


📁 Project Structure

taskflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Database connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js # Login, register logic
│   │   │   ├── task.controller.js # Task CRUD operations
│   │   │   └── project.controller.js # Project operations
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js # JWT verification
│   │   │   └── role.middleware.js # Admin/Member check
│   │   ├── models/
│   │   │   ├── user.model.js      # User data operations
│   │   │   ├── Task.model.js      # Task data operations
│   │   │   └── Project.model.js   # Project data operations
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # /api/auth/*
│   │   │   ├── task.routes.js     # /api/tasks/*
│   │   │   ├── user.routes.js     # /api/users/*
│   │   │   └── project.routes.js  # /api/projects/*
│   │   ├── socket/
│   │   │   └── socket.js          # Socket.io event handlers
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axios.js           # Axios base config + interceptor
    │   │   ├── tasks.api.js       # Task API calls
    │   │   └── projects.api.js    # Project API calls
    │   ├── components/
    │   │   ├── Navbar.jsx         # Top navigation bar
    │   │   └── PrivateRoute.jsx   # Protected route wrapper
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Global auth state
    │   │   └── SocketContext.jsx  # Global socket connection
    │   ├── hooks/
    │   │   ├── useAuth.js         # Auth context hook
    │   │   └── useSocket.js       # Socket context hook
    │   ├── pages/
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Register.jsx       # Register page
    │   │   ├── Dashboard.jsx      # Projects dashboard
    │   │   └── Board.jsx          # Kanban board page
    │   ├── App.jsx                # Routes setup
    │   └── main.jsx               # React entry point
    └── package.json


⚙️ API Endpoints

Auth Routes

MethodEndpointDescriptionAuth RequiredPOST/api/auth/registerRegister new userNoPOST/api/auth/loginLogin userNoGET/api/auth/meGet current userYes

Project Routes

MethodEndpointDescriptionAuth RequiredGET/api/projectsGet all projectsYesPOST/api/projectsCreate projectAdmin onlyGET/api/projects/:idGet single projectYesPOST/api/projects/:id/membersAdd memberAdmin only

Task Routes

MethodEndpointDescriptionAuth RequiredGET/api/tasks/:projectIdGet all tasksYesPOST/api/tasksCreate taskYesPUT/api/tasks/:idUpdate taskYesDELETE/api/tasks/:idDelete taskAdmin/Creator

Socket Events

EventDirectionDescriptionjoin_projectClient → ServerJoin project roomtask:createdServer → ClientNew task createdtask:updatedServer → ClientTask status changedtask:deletedServer → ClientTask deleted


🏃 Run Locally

Prerequisites


Node.js v18+
Git


Clone the repository

bashgit clone https://github.com/Yash-tech-art/taskflow.git
cd taskflow

Setup Backend

bashcd backend
npm install

Create a .env file inside backend/:

envPORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development

Start the backend:

bashnode src/server.js

Setup Frontend

Open a new terminal:

bashcd frontend
npm install
npm run dev

Open http://localhost:5173 in your browser.


🔑 Default Test Accounts

After running locally, register a new account at /register.

For Admin access, select "Admin" role during registration.
For Member access, select "Member" role during registration.


🌐 How Frontend Connects to Backend

React Component
      ↓
tasks.api.js / projects.api.js
      ↓
axios.js (auto-attaches JWT token)
      ↓
Vite proxy (dev) / VITE_API_URL (prod)
      ↓
Express Backend (port 5000)
      ↓
JSON Database (db.json)


🔒 Security Features


Passwords hashed with bcryptjs (salt factor 10)
JWT tokens expire after 7 days
Role checks enforced server-side (not just UI)
CORS configured to allow only trusted origins
Environment variables for all secrets



🚀 Deployment

Frontend — Vercel


Connect GitHub repo to Vercel
Set Root Directory to frontend
Add environment variable: VITE_API_URL=https://your-render-url.onrender.com/api


Backend — Render


Connect GitHub repo to Render
Set Root Directory to backend
Start Command: node src/server.js
Add environment variables: JWT_SECRET, NODE_ENV=production



👨‍💻 Author

Yash — 2nd Year B.Voc Student

Built as an internship portfolio project demonstrating full-stack MERN development skills.


📄 License

MIT License — feel free to use this project for learning purposes.
