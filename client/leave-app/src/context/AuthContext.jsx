
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, userLogout, userProfile } from '../api/auth';
import { allUsers, createUser, toggleUserStatus } from '../api/admin_api';

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
          console.log("profile",profile)
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
  const registerEmployee = async (employeeData) => {
    try {
        console.log("insde auth the form data is",employeeData)
        const newUser = await createUser(employeeData);
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
  };

  // Update user status (block/unblock)
  const updateUserStatus = async (userId, newActiveStatus) => {
    try {
        console.log(userId,",",newActiveStatus)
      const success = await toggleUserStatus(userId);
      if (success) {
        setCurrentUser((prevUser) =>
          prevUser?.id === userId ? { ...prevUser, active: !prevUser.active } : prevUser
        );
  
        // If blocking the current user, force logout
        if (!prevUser?.active && prevUser?.id === userId) {
          logout();
        }
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
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
