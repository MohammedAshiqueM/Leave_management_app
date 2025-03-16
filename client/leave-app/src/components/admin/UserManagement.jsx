import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { getAllUsers, updateUserStatus, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      
      try {
        const userData = await getAllUsers();
        console.log("''''''",userData)
        setUsers(userData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [getAllUsers, isAdmin]);
  
  const handleStatusChange = async (userId, newActiveStatus) => {
    try {
        console.log("handle status",userId)
      await updateUserStatus(userId, newActiveStatus);
      
      // Update local state
      setUsers(prev => 
        prev.map(user => 
          user.user.id === userId ? { ...user, user: { ...user.user, is_active: newActiveStatus }} : user
        )
      );
      
      // Display success message
      alert(`User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Failed to update user status:", error);
      alert("Failed to update user status");
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-red-600">
        You do not have permission to access this page.
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse-soft">Loading users...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-medium overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Manage Users</h2>
      </div>
      
      {users.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User.ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th> */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium">#{user.user.id}</td>
                  <td className="px-4 py-4 text-sm">{user.user.username}</td>
                  <td className="px-4 py-4 text-sm">{user.user.email}</td>
                  {/* <td className="px-4 py-4 text-sm">{user.department}</td> */}
                  <td className="px-4 py-4 text-sm capitalize">{user.role}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.user.is_active 
                        ? 'bg-success/10 text-success' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {user.user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <button
                      onClick={() => handleStatusChange(user.user.id, !user.user.is_active)}
                      className={`px-3 py-1 rounded text-white text-xs ${
                        user.user.is_active 
                          ? 'bg-destructive hover:bg-destructive/90' 
                          : 'bg-success hover:bg-success/90'
                      }`}
                    >
                      {user.user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;