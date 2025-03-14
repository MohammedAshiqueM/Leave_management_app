
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LeaveTable = ({ mode }) => {
  const { currentUser, isAdmin } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load leave requests from localStorage (simulate API)
    const storedLeaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    
    // Filter based on mode
    let filteredLeaves = [];
    
    if (mode === 'admin') {
      // Admin mode: Show all leaves with pending status for review
      filteredLeaves = storedLeaves.filter(leave => leave.status === 'pending');
    } else {
      // Employee mode: Show only current user's leaves
      filteredLeaves = storedLeaves.filter(leave => leave.userId === currentUser.id);
    }
    
    setLeaveRequests(filteredLeaves);
    setLoading(false);
  }, [currentUser, mode]);
  
  const handleStatusChange = (leaveId, newStatus) => {
    // Get all stored leave requests
    const allLeaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    
    // Update the status of the specific leave request
    const updatedLeaves = allLeaves.map(leave => 
      leave.id === leaveId ? { ...leave, status: newStatus } : leave
    );
    
    // Save back to localStorage
    localStorage.setItem('leaveRequests', JSON.stringify(updatedLeaves));
    
    // Update state to reflect the change
    setLeaveRequests(prev => 
      prev.filter(leave => leave.id !== leaveId)
    );
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning';
      case 'approved':
        return 'bg-success/10 text-success';
      case 'rejected':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  if (loading) {
    return (
      <div className="p-4 text-center animate-pulse-soft">
        Loading leave requests...
      </div>
    );
  }
  
  if (leaveRequests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-medium p-8 text-center text-gray-500">
        {mode === 'admin' 
          ? 'No pending leave requests to review.' 
          : 'You have no leave requests. Apply for leave to see your requests here.'}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-medium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {mode === 'admin' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                To
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              {mode === 'admin' && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="hover:bg-gray-50">
                {mode === 'admin' && (
                  <td className="px-4 py-4 text-sm">
                    <div>
                      <div className="font-medium">{leave.userName}</div>
                      <div className="text-gray-500">{leave.department}</div>
                    </div>
                  </td>
                )}
                <td className="px-4 py-4 text-sm capitalize">{leave.leaveType}</td>
                <td className="px-4 py-4 text-sm">{formatDate(leave.startDate)}</td>
                <td className="px-4 py-4 text-sm">{formatDate(leave.endDate)}</td>
                <td className="px-4 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm max-w-xs truncate" title={leave.reason}>
                  {leave.reason}
                </td>
                {mode === 'admin' && (
                  <td className="px-4 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(leave.id, 'approved')}
                        className="px-3 py-1 bg-success text-white rounded-md text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(leave.id, 'rejected')}
                        className="px-3 py-1 bg-destructive text-white rounded-md text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;
