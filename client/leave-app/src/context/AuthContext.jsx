
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, userLogout, userProfile } from '../api/auth';
import { allUsers } from '../api/admin_api';

// Create the authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check for saved auth on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        try {
          // Fetch the user profile
          const profile = await userProfile();
          setCurrentUser(profile);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          userLogout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    setError(null);
    setLoading(true);

    try {
      
      const { access, refresh } = await loginUser({ username, password }); // Call the login API

      const profile = await userProfile(); // Fetch the user profile
      setCurrentUser(profile);

      // Redirect based on role
      if (profile.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.detail || 'Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    userLogout();
    navigate('/login');
  };

  // Register new employee (admin only)
  const registerEmployee = (employeeData) => {
    // Generate ID (in real app, this would come from backend)
    const newId = Math.max(...users.map(u => u.id)) + 1;
    
    const newEmployee = {
      id: newId,
      ...employeeData,
      active: true,
      role: 'employee' // Force role to be employee
    };
    
    const updatedUsers = [...users, newEmployee];
    setUsers(updatedUsers);
    
    return newEmployee;
  };

  // Update user status (block/unblock)
  const updateUserStatus = (userId, active) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, active } : user
    );
    
    setUsers(updatedUsers);
    
    // If blocking current user, force logout
    if (!active && currentUser && currentUser.id === userId) {
      logout();
    }
    
    return updatedUsers.find(user => user.id === userId);
  };

  // Get all users (admin only)
  const getAllUsers = async () => {
    const users = await allUsers()
    console.log("the users are",users)
    return users
  };

  // The authentication context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    registerEmployee,
    updateUserStatus,
    getAllUsers,
    isAdmin: currentUser?.role === 'admin',
    isEmployee: currentUser?.role === 'employee',
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
