
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-medium">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Leave Management System</h1>
        <p className="mt-2 text-gray-600">Sign in to your account</p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-white bg-destructive rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="input-field w-full mt-1"
            placeholder="email"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full mt-1"
            placeholder="Password"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>Demo accounts:</p>
          <p>Admin: email: admin | password: admin123</p>
          <p>Employee: email: employee1 | password: emp123</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
