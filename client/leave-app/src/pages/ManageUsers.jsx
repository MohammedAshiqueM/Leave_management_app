
import React from 'react';
import Layout from '../layout/Layout';
import UserManagement from '../components/admin/UserManagement';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
    }
  }, [isAdmin, navigate]);
  
  if (!isAdmin) return null;
  
  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          
          <button
            onClick={() => navigate('/register-employee')}
            className="btn-primary px-4 py-2 rounded-md"
          >
            Register New Employee
          </button>
        </div>
        
        <UserManagement />
      </div>
  );
};

export default ManageUsers;
