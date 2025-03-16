
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createLeave } from '../../api/leave_api';

const LeaveForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leave_type: 'casual',
    start_date: '',
    end_date: '',
    reason: '',
    contactInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const leaveTypes = [
    { id: 'casual', label: 'Casual Leave' },
    { id: 'sick', label: 'Sick Leave' },
    { id: 'other', label: 'Other Leave' },
    // { id: 'unpaid', label: 'Unpaid Leave' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (!formData.start_date || !formData.end_date) {
      setError("Please select both start and end dates");
      return;
    }

    const start_date = new Date(formData.start_date);
    const end_date = new Date(formData.end_date);
    
    if (end_date < start_date) {
      setError("End date cannot be before start date");
      return;
    }

    // Submit form
    setIsSubmitting(true);

    try {
        // Create leave request object
        const leaveRequest = {
          userId: currentUser.id,
          userName: currentUser.name,
          department: currentUser.department,
          ...formData,
          appliedDate: new Date().toISOString(),
        };
    
        // Call the API function
        const response = await createLeave(leaveRequest);
        
        setIsSubmitting(false);
        
        // Show success message
        alert("Leave request submitted successfully");
        
        navigate('/my-leaves');
      } catch (error) {
        console.error("Registration error:", error);
        
        // Handle structured API errors
        if (typeof error === 'object' && error !== null) {
          // Format the error message from the API response
          const errorMessages = [];
          
          for (const [field, messages] of Object.entries(error)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
          
          if (errorMessages.length > 0) {
            setError(errorMessages.join('\n'));
          } else {
            setError("Failed to register employee");
          }
        } else {
          setError(error.message || "Failed to register employee");
        }
      } finally {
      setIsSubmitting(false);
    }

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
              name="leave_type"
              value={formData.leave_type}
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
              name="start_date"
              value={formData.start_date}
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
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="input-field w-full"
              required
              min={formData.start_date  || new Date().toISOString().split('T')[0]}
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
