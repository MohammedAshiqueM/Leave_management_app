
import React from 'react';
import Layout from '../layout/Layout';
import RegisterEmployeeForm from '../components/admin/RegisterEmployee';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterEmployeePage = () => {
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
          <h1 className="text-2xl font-bold">Register New Employee</h1>
          
          <button
            onClick={() => navigate('/manage-users')}
            className="btn-primary px-4 py-2 rounded-md"
          >
            View All Users
          </button>
        </div>
        
        <RegisterEmployeeForm />
      </div>
  );
};

export default RegisterEmployeePage;
