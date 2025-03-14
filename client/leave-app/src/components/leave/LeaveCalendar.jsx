
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LeaveCalendar = () => {
  const { isAdmin, currentUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  useEffect(() => {
    // Load leave data
    const storedLeaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    
    // Filter to only show approved leaves
    let approvedLeaves = storedLeaves.filter(leave => leave.status === 'approved');
    
    // If not admin, only show current user's leaves and team leaves
    if (!isAdmin) {
      approvedLeaves = approvedLeaves.filter(leave => 
        leave.userId === currentUser.id || leave.department === currentUser.department
      );
    }
    
    setLeaves(approvedLeaves);
  }, [isAdmin, currentUser]);
  
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate, leaves]);
  
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month and number of days in month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Get days from previous month to fill first week
    const prevMonthDays = [];
    if (firstDayWeekday > 0) {
      const prevMonth = new Date(year, month, 0);
      const prevMonthDaysCount = prevMonth.getDate();
      
      for (let i = prevMonthDaysCount - firstDayWeekday + 1; i <= prevMonthDaysCount; i++) {
        prevMonthDays.push({
          date: new Date(year, month - 1, i),
          currentMonth: false,
          day: i
        });
      }
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, month, i),
        currentMonth: true,
        day: i
      });
    }
    
    // Next month days to fill last week
    const nextMonthDays = [];
    const totalDaysSoFar = prevMonthDays.length + currentMonthDays.length;
    const daysToAdd = 42 - totalDaysSoFar; // 42 = 6 rows of 7 days
    
    for (let i = 1; i <= daysToAdd; i++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
        day: i
      });
    }
    
    setCalendarDays([...prevMonthDays, ...currentMonthDays, ...nextMonthDays]);
  };
  
  const moveMonth = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + amount);
    setCurrentDate(newDate);
  };
  
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  const getLeavesForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    return leaves.filter(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      
      // Check if the date is between start and end
      const currentDate = new Date(formattedDate);
      return currentDate >= startDate && currentDate <= endDate;
    });
  };
  
  const getDayClass = (day) => {
    let classes = 'h-24 border border-gray-200 p-1 transition hover:bg-gray-50';
    
    if (!day.currentMonth) {
      classes += ' bg-gray-100 text-gray-400';
    }
    
    // If today
    const today = new Date();
    if (day.date.toDateString() === today.toDateString()) {
      classes += ' bg-blue-50 font-bold';
    }
    
    return classes;
  };
  
  const getLeaveClass = (type) => {
    switch (type) {
      case 'annual':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sick':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'personal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'unpaid':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-medium overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold">Leave Calendar</h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => moveMonth(-1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            &larr;
          </button>
          
          <span className="font-medium">{formatMonthYear(currentDate)}</span>
          
          <button
            onClick={() => moveMonth(1)}
            className="p-1 rounded hover:bg-gray-100"
          >
            &rarr;
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 text-sm text-center bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 grid-rows-6 text-sm">
        {calendarDays.map((day, index) => {
          const dayLeaves = getLeavesForDate(day.date);
          
          return (
            <div key={index} className={getDayClass(day)}>
              <div className={`${!day.currentMonth ? 'text-gray-400' : ''}`}>{day.day}</div>
              
              <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                {dayLeaves.map((leave, leaveIndex) => (
                  <div 
                    key={leaveIndex}
                    className={`text-xs p-1 rounded border truncate ${getLeaveClass(leave.leaveType)}`}
                    title={`${leave.userName || 'You'} - ${leave.leaveType} leave`}
                  >
                    {leave.userName !== currentUser.name ? leave.userName : 'You'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaveCalendar;
