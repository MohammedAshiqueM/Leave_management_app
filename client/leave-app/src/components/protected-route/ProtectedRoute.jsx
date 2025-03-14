import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth check running");
    console.log("the current user",currentUser)
    if (!loading && !currentUser) {
      console.log("No user, redirecting to login");
      navigate('/login');
    }
  }, [currentUser, navigate, loading]);

  if (loading) return <div>Loading...</div>;
  
  if (!currentUser) return null;
  
  return children;
};

export default ProtectedRoute;