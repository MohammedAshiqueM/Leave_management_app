
import React from 'react';
import Layout from '../layout/Layout';
import LeaveCalendarComponent from '../components/leave/LeaveCalendar';
import { useAuth } from '../context/AuthContext';

const LeaveCalendarPage = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;
  
  return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Leave Calendar</h1>
        <p className="text-gray-600">
          This calendar shows all approved leave requests for your department.
          {currentUser.role === 'admin' && ' As an admin, you can see leaves across all departments.'}
        </p>
        
        <LeaveCalendarComponent />
      </div>
  );
};

export default LeaveCalendarPage;
