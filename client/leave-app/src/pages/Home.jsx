
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useAuth } from '../context/AuthContext';
import LeaveTable from '../components/leave/LeaveTable';

const Home = () => {
  const { currentUser, isEmployee, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [leaveStats, setLeaveStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
    remaining: 20, // Default annual leave allowance
  });
  
  useEffect(() => {
    if (isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    // Calculate leave stats for current user
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    const userLeaves = leaveRequests.filter(leave => leave.userId === currentUser.id);
    
    const approved = userLeaves.filter(leave => leave.status === 'approved').length;
    const rejected = userLeaves.filter(leave => leave.status === 'rejected').length;
    const pending = userLeaves.filter(leave => leave.status === 'pending').length;
    
    // Calculate annual leave days used (only for annual leave type)
    const annualLeaveUsed = userLeaves
      .filter(leave => leave.status === 'approved' && leave.leaveType === 'annual')
      .reduce((total, leave) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);
    
    // Assume 20 days annual leave per year
    const remaining = Math.max(0, 20 - annualLeaveUsed);
    
    setLeaveStats({ approved, rejected, pending, remaining });
  }, [currentUser, isEmployee, navigate]);
  
  if (!isEmployee) return null;
  
  return (
    // <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-medium border-l-4 border-primary">
            <div className="text-sm text-gray-500 mb-1">Annual Leave Remaining</div>
            <div className="text-3xl font-bold">{leaveStats.remaining} days</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium border-l-4 border-warning">
            <div className="text-sm text-gray-500 mb-1">Pending Requests</div>
            <div className="text-3xl font-bold">{leaveStats.pending}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium border-l-4 border-success">
            <div className="text-sm text-gray-500 mb-1">Approved Leaves</div>
            <div className="text-3xl font-bold">{leaveStats.approved}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium border-l-4 border-destructive">
            <div className="text-sm text-gray-500 mb-1">Rejected Leaves</div>
            <div className="text-3xl font-bold">{leaveStats.rejected}</div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate('/apply-leave')}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">Apply for Leave</h3>
            <p className="text-gray-500">Submit a new leave request</p>
          </button>
          
          <button
            onClick={() => navigate('/my-leaves')}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">My Leaves</h3>
            <p className="text-gray-500">View all your leave requests</p>
          </button>
          
          <button
            onClick={() => navigate('/leave-calendar')}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">Leave Calendar</h3>
            <p className="text-gray-500">View team leave schedule</p>
          </button>
        </div>
        
        {/* Recent Leave Requests */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Leave Requests</h2>
          <LeaveTable mode="employee" />
        </div>
      </div>
    // </Layout>
  );
};

export default Home;
