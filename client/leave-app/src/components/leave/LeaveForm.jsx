
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LeaveForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: '',
    contactInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const leaveTypes = [
    { id: 'annual', label: 'Annual Leave' },
    { id: 'sick', label: 'Sick Leave' },
    { id: 'personal', label: 'Personal Leave' },
    { id: 'unpaid', label: 'Unpaid Leave' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates");
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      setError("End date cannot be before start date");
      return;
    }

    // Submit form
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Mock data that would normally come from API
      const leaveRequest = {
        id: Math.floor(Math.random() * 10000),
        userId: currentUser.id,
        userName: currentUser.name,
        department: currentUser.department,
        ...formData,
        status: 'pending',
        appliedDate: new Date().toISOString(),
      };

      // Save to localStorage for demo purposes
      const existingLeaves = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
      localStorage.setItem('leaveRequests', JSON.stringify([...existingLeaves, leaveRequest]));

      setIsSubmitting(false);
      
      // Show success message (use an alert in this simple version)
      alert("Leave request submitted successfully");
      
      navigate('/my-leaves');
    }, 1000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-medium">
      <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-white bg-destructive rounded">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="input-field w-full"
              required
            >
              {leaveTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input-field w-full"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input-field w-full"
              required
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Phone number or email"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Leave
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            className="input-field w-full"
            placeholder="Please provide details about your leave request"
            required
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/my-leaves')}
            className="btn-secondary px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary px-4 py-2 rounded-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveForm;
