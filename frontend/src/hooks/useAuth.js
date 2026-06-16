import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook — instead of importing AuthContext everywhere
// we just call useAuth() and get user, login, logout
const useAuth = () => useContext(AuthContext);

export default useAuth;