import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllLeaves } from '../../api/admin_api';
import { getIUserLeaves } from '../../api/leave_api';

const LeaveCalendar = () => {
  const { isAdmin, currentUser } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  
  useEffect(() => {
    const fetchLeaves = async () => {
      setIsLoading(true);
      try {
        let data;
        if (isAdmin) {
          // Admin mode: Show all leaves
          data = await getAllLeaves();
        } else {
          // Employee mode: Show only current user's leaves
          data = await getIUserLeaves();
        }
        
        // Filter to only show approved leaves for the calendar view
        const approvedLeaves = data.filter(leave => leave.status === 'approved');
        console.log("the leaves for calender", approvedLeaves);
        
        // If not admin, ensure we only show current user's leaves
        const filteredLeaves = isAdmin 
          ? approvedLeaves 
          : approvedLeaves.filter(leave => 
              leave.user.id === currentUser.id
            );
            
        setLeaves(filteredLeaves);
        console.log(filteredLeaves)
        setError(null);
      } catch (err) {
        setError('Failed to load leave data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaves();
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
  
  // Fixed date comparison function
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  // Fixed date range check
  const isDateInRange = (date, startDate, endDate) => {
    // Normalize all dates to start of day in local time
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    
    const normalizedStart = new Date(startDate);
    normalizedStart.setHours(0, 0, 0, 0);
    
    const normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(0, 0, 0, 0);
    
    return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
  };
  
  const getLeavesForDate = (date) => {
    return leaves.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      
      return isDateInRange(date, startDate, endDate);
    });
  };
  
  const getDayClass = (day) => {
    let classes = 'h-24 border border-gray-200 p-1 transition cursor-pointer';
    
    if (!day.currentMonth) {
      classes += ' bg-gray-100 text-gray-400';
    } else {
      classes += ' hover:bg-gray-50';
    }
    
    // If today
    const today = new Date();
    if (isSameDay(day.date, today)) {
      classes += ' bg-blue-50 font-bold';
    }
    
    // If selected
    if (selectedDay && isSameDay(day.date, selectedDay.date)) {
      classes += ' ring-2 ring-blue-500';
    }
    
    return classes;
  };
  
  const getLeaveClass = (type) => {
    switch (type) {
      case 'casual':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sick':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'other':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'unpaid':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  // Group leaves by type
  const groupLeavesByType = (dayLeaves) => {
    const grouped = {};
    
    dayLeaves.forEach(leave => {
      const type = leave.leave_type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(leave);
    });
    
    return grouped;
  };
  
  const closeDetailModal = () => {
    setSelectedDay(null);
  };
  
  // Function to format a date in a consistent way
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading leave data...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
          <button 
            onClick={() => fetchLeaves()} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-7 grid-rows-6 text-sm">
          {calendarDays.map((day, index) => {
            const dayLeaves = getLeavesForDate(day.date);
            const groupedLeaves = groupLeavesByType(dayLeaves);
            const leaveTypes = Object.keys(groupedLeaves);
            
            return (
              <div 
                key={index} 
                className={getDayClass(day)}
                onClick={() => {
                  if (dayLeaves.length > 0) {
                    setSelectedDay(day);
                  }
                }}
              >
                <div className={`${!day.currentMonth ? 'text-gray-400' : ''}`}>
                  {day.day}
                </div>
                
                <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                  {/* Display first type-grouped entry */}
                  {leaveTypes.length > 0 && (
                    <div 
                      className={`text-xs p-1 rounded border truncate ${getLeaveClass(leaveTypes[0])}`}
                    >
                      {groupedLeaves[leaveTypes[0]][0].user && 
                       groupedLeaves[leaveTypes[0]][0].user.username !== currentUser.username ? 
                       groupedLeaves[leaveTypes[0]][0].user.username : 'You'}
                        
                      {groupedLeaves[leaveTypes[0]].length > 1 && 
                        ` +${groupedLeaves[leaveTypes[0]].length - 1} more`}
                    </div>
                  )}
                  
                  {/* Display second type-grouped entry if exists */}
                  {leaveTypes.length > 1 && (
                    <div 
                      className={`text-xs p-1 rounded border truncate ${getLeaveClass(leaveTypes[1])}`}
                    >
                      {groupedLeaves[leaveTypes[1]][0].user && 
                       groupedLeaves[leaveTypes[1]][0].user.username !== currentUser.username ? 
                       groupedLeaves[leaveTypes[1]][0].user.username : 'You'}
                        
                      {groupedLeaves[leaveTypes[1]].length > 1 && 
                        ` +${groupedLeaves[leaveTypes[1]].length - 1} more`}
                    </div>
                  )}
                  
                  {/* Show additional counter if there are more leave types */}
                  {leaveTypes.length > 2 && (
                    <div className="text-xs p-1 rounded border bg-gray-100 text-gray-800 text-center font-medium">
                      +{leaveTypes.length - 2} more types
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Detail Modal for Selected Day */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Leaves for {formatDate(selectedDay.date)}
              </h3>
              <button 
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-2">
              {getLeavesForDate(selectedDay.date).map((leave, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded border ${getLeaveClass(leave.leave_type)}`}
                >
                  <div className="font-medium">
                    {leave.user && leave.user.username !== currentUser.username 
                      ? leave.user.username 
                      : 'You'}
                  </div>
                  <div className="text-sm">
                    {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)} leave
                  </div>
                  <div className="text-xs">
                    {formatDate(new Date(leave.start_date))} to {formatDate(new Date(leave.end_date))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveCalendar;