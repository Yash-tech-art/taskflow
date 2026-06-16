import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          TaskFlow
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Role badge */}
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            user?.role === 'admin'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {user?.role}
          </span>

          {/* User name */}
          <span className="text-sm text-gray-600 font-medium">
            {user?.name}
          </span>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;