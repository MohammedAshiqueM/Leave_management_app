
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to={isAdmin ? '/dashboard' : '/home'} className="text-xl font-bold">
            Leave Management System
          </Link>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex space-x-6">
              {isAdmin ? (
                <>
                  <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                  <Link to="/register-employee" className="hover:text-gray-200">Register Employee</Link>
                  <Link to="/manage-users" className="hover:text-gray-200">Manage Users</Link>
                </>
              ) : (
                <>
                  <Link to="/home" className="hover:text-gray-200">Home</Link>
                  <Link to="/apply-leave" className="hover:text-gray-200">Apply Leave</Link>
                  <Link to="/my-leaves" className="hover:text-gray-200">My Leaves</Link>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden md:inline">{currentUser?.name}</span>
              <button 
                onClick={logout} 
                className="px-3 py-1 bg-white text-primary rounded hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu for small screens */}
      <div className="md:hidden bg-gray-100 shadow-inner">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between space-x-4">
            {isAdmin ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-700 hover:text-primary">Dashboard</Link>
                <Link to="/register-employee" className="text-sm text-gray-700 hover:text-primary">Register</Link>
                <Link to="/manage-users" className="text-sm text-gray-700 hover:text-primary">Users</Link>
              </>
            ) : (
              <>
                <Link to="/home" className="text-sm text-gray-700 hover:text-primary">Home</Link>
                <Link to="/apply-leave" className="text-sm text-gray-700 hover:text-primary">Apply</Link>
                <Link to="/my-leaves" className="text-sm text-gray-700 hover:text-primary">My Leaves</Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Leave Management System
        </div>
      </footer>
    </div>
  );
};

export default Layout;
