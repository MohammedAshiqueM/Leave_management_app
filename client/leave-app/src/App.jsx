import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

// Components
import Layout from './layout/Layout';
// import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";
import LeaveCalendar from "./pages/LeaveCalendar";
import RegisterEmployee from "./pages/RegisterEmployee";
import ManageUsers from "./pages/ManageUsers";
import ProtectedRoute from './components/protected-route/ProtectedRoute';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/apply-leave" element={
            <ProtectedRoute>
              <Layout>
                <ApplyLeave />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/my-leaves" element={
            <ProtectedRoute>
              <Layout>
                <MyLeaves />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/leave-calendar" element={
            <ProtectedRoute>
              <Layout>
                <LeaveCalendar />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/register-employee" element={
            <ProtectedRoute>
              <Layout>
                <RegisterEmployee />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/manage-users" element={
            <ProtectedRoute>
              <Layout>
                <ManageUsers />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;