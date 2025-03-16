
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useAuth } from '../context/AuthContext';
import LeaveTable from '../components/leave/LeaveTable';
import { getAllLeaves } from '../api/admin_api';
import { getIUserLeaves } from '../api/leave_api';

const Home = () => {
  const { currentUser, isEmployee, isAdmin } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  
  const navigate = useNavigate();
  const [leaveStats, setLeaveStats] = useState({
    approved: 0,
    rejected: 0,
    pending: 0,
  });
  useEffect(() => {
    
      const fetchLeaves = async () =>{
        const data = await getIUserLeaves()
        setLeaveRequests(data);

      }
      fetchLeaves()
    }, [currentUser]);
    
  useEffect(() => {
    if (isAdmin) {
      navigate('/dashboard');
      return;
    }

    if (leaveRequests.length > 0) {
        const approved = leaveRequests.filter(leave => leave.status === 'approved').length;
        const rejected = leaveRequests.filter(leave => leave.status === 'rejected').length;
        const pending = leaveRequests.filter(leave => leave.status === 'pending').length;
        
        setLeaveStats({ approved, rejected, pending });
      }
  }, [leaveRequests, isEmployee, navigate]);
  
  const getFilteredLeaveRequests = () => {
    return leaveRequests.filter(leave => leave.status === activeTab);
  };
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getUserFirstName = () => {
    if (!currentUser || !currentUser.user) return '';
    
    const name = currentUser.user.name || currentUser.user.username || '';
    return name.split(' ')[0];
  };

  const statsCardsConfig = [
    {
      id: 'casual-leave',
      label: 'Casual Leave Remaining',
      value: currentUser.casual_leave_balance,
      borderColor: 'border-primary'
    },
    {
      id: 'sick-leave',
      label: 'Sick Leave Remaining',
      value: currentUser.sick_leave_balance,
      borderColor: 'border-teal-400'
    },
    {
      id: 'pending-request',
      label: 'Pending Requests',
      value: leaveStats.pending,
      borderColor: 'border-warning'
    },
    {
      id: 'approved-leaves',
      label: 'Approved Leaves',
      value: leaveStats.approved,
      borderColor: 'border-success'
    },
    {
      id: 'rejected-leaves',
      label: 'Rejected Leaves',
      value: leaveStats.rejected,
      borderColor: 'border-destructive'
    }
  ];
  
  // Define quick actions configuration
  const quickActionsConfig = [
    {
      id: 'apply-leaves',
      title: 'Apply for Leave',
      description: 'Submit a new leave request',
      route: '/apply-leave'
    },
    {
      id: 'my-leaves',
      title: 'My Leaves',
      description: 'View all your leave requests',
      route: '/my-leaves'
    },
    {
      id: 'leave-calendar',
      title: 'Leave Calendar',
      description: 'View all your approved leave requests',
      route: '/leave-calendar'
    }
  ];

  const tabsConfig = [
    {
        id: 'pending',
        label: 'Pending',
        count: leaveStats.pending,
        activeColor: 'primary'
    },
    {
        id: 'approved',
        label: 'Approved',
        count: leaveStats.approved,
        activeColor: 'success'
    },
    {
        id: 'rejected',
        label: 'Rejected',
        count: leaveStats.rejected,
        activeColor: 'destructive'
    }
    ];
  if (!isEmployee) return null;
  
  return (
    // <Layout>
      <div className="space-y-6">
        {/* User Welcome Section */}
        <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold">Employee Dashboard</h1>
                <p className="text-gray-600 mt-1">
                {getGreeting()}, {getUserFirstName()}.
                </p>
            </div>
            <div className="mt-4 md:mt-0">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                <span className="font-medium">
                    {currentUser?.user?.username}
                </span>
                </div>
            </div>
            </div>
        </div>

        {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statsCardsConfig.map((card) => (
          <div 
            key={card.id}
            className={`bg-white p-6 rounded-lg shadow-medium border-l-4 ${card.borderColor}`}
          >
            <div className="text-sm text-gray-500 mb-1">{card.label}</div>
            <div className="text-3xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActionsConfig.map((action) => (
          <button
            key={action.id}
            onClick={() => navigate(action.route)}
            className="bg-white p-6 rounded-lg shadow-medium text-left hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">{action.title}</h3>
            <p className="text-gray-500">{action.description}</p>
          </button>
        ))}
      </div>
        
        {/* Leave Requests */}
        <div className="bg-white rounded-lg shadow-medium">
            <div className="border-b">
            <nav className="flex" aria-label="Tabs">
                {tabsConfig.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`${
                    activeTab === tab.id
                        ? `border-${tab.activeColor} text-${tab.activeColor}`
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                    {tab.label} ({tab.count})
                </button>
                ))}
            </nav>
            </div>
            <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Leave Requests
            </h2>
            <LeaveTable mode="employee" data={getFilteredLeaveRequests()} activeTab={"rejected"} />
            </div>
        </div>
      </div>
    // </Layout>
  );
};

export default Home;
