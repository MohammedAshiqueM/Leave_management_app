
import React from 'react';
import Layout from '../layout/Layout';
import LeaveForm from '../components/leave/LeaveForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ApplyLeave = () => {
  const { isEmployee } = useAuth();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isEmployee) {
      navigate('/dashboard');
    }
  }, [isEmployee, navigate]);
  
  if (!isEmployee) return null;
  
  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Apply for Leave</h1>
          
          <button
            onClick={() => navigate('/my-leaves')}
            className="btn-primary px-4 py-2 rounded-md"
          >
            View My Leaves
          </button>
        </div>
        
        <LeaveForm />
      </div>
  );
};

export default ApplyLeave;
