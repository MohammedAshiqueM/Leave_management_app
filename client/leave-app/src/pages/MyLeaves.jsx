
import React from 'react';
import Layout from '../layout/Layout';
import LeaveTable from '../components/leave/LeaveTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyLeaves = () => {
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
          <h1 className="text-2xl font-bold">My Leave Requests</h1>
          
          <button
            onClick={() => navigate('/apply-leave')}
            className="btn-primary px-4 py-2 rounded-md"
          >
            Apply New Leave
          </button>
        </div>
        
        <LeaveTable mode="employee" />
      </div>
  );
};

export default MyLeaves;
