
import React, { useEffect, useState } from 'react';
import Layout from '../layout/Layout';
import LeaveTable from '../components/leave/LeaveTable';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getIUserLeaves } from '../api/leave_api';

const MyLeaves = () => {
//   const { isEmployee } = useAuth();
//   const navigate = useNavigate();
  

const { currentUser, isEmployee, isAdmin } = useAuth();
const [leaveRequests, setLeaveRequests] = useState([]);
const [activeTab, setActiveTab] = useState('pending');

  const navigate = useNavigate();
  const [leaveStats, setLeaveStats] = useState({
      approved: 0,
      rejected: 0,
      pending: 0,
    });
    React.useEffect(() => {
      if (!isEmployee) {
        navigate('/dashboard');
      }
    }, [isEmployee, navigate]);
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
                <LeaveTable mode="employee" data={getFilteredLeaveRequests()} activeTab={activeTab}/>
            </div>
        </div>
    </div>
  );
};

export default MyLeaves;
