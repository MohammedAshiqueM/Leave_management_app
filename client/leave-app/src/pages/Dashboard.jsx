
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useAuth } from '../context/AuthContext';
import LeaveTable from '../components/leave/LeaveTable';

const Dashboard = () => {
  const { isAdmin, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [leaveStats, setLeaveStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0
  });
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/home');
      return;
    }
    
    const fetchUsers = async () => {
        try {
          const users = await getAllUsers(); // Await the async function
          console.log("users inside dashboard", users);
          
          // Ensure users is an array before filtering
          if (Array.isArray(users)) {
            setEmployeeCount(users.filter(user => user.role === 'employee' && user.active).length);
          } else {
            console.error("getAllUsers did not return an array", users);
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
    
      fetchUsers();
    
    
    // Get leave stats
    const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    setPendingCount(leaveRequests.filter(leave => leave.status === 'pending').length);
    
    // Calculate leave stats
    const approved = leaveRequests.filter(leave => leave.status === 'approved').length;
    const rejected = leaveRequests.filter(leave => leave.status === 'rejected').length;
    const pending = leaveRequests.filter(leave => leave.status === 'pending').length;
    
    setLeaveStats({ approved, rejected, pending });
  }, [isAdmin, navigate, getAllUsers]);
  
  if (!isAdmin) return null;
  
  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-medium border-l-4 border-primary">
            <div className="text-sm text-gray-500 mb-1">Total Employees</div>
            <div className="text-3xl font-bold">{employeeCount}</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium border-l-4 border-warning">
            <div className="text-sm text-gray-500 mb-1">Pending Leaves</div>
            <div className="text-3xl font-bold">{pendingCount}</div>
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
            onClick={() => navigate('/register-employee')}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">Register Employee</h3>
            <p className="text-gray-500">Add new employees to the system</p>
          </button>
          
          <button
            onClick={() => navigate('/manage-users')}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">Manage Users</h3>
            <p className="text-gray-500">View and manage user accounts</p>
          </button>
          
          <button
            onClick={() => navigate('/leave-calendar')}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">Leave Calendar</h3>
            <p className="text-gray-500">View all approved leave requests</p>
          </button>
        </div>
        
        {/* Pending Leave Requests */}
        <div>
          <h2 className="text-xl font-bold mb-4">Pending Leave Requests</h2>
          <LeaveTable mode="admin" />
        </div>
      </div>
  );
};

export default Dashboard;
