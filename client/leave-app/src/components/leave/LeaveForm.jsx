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
  const [errors, setErrors] = useState({});

  const leaveTypes = [
    { id: 'casual', label: 'Casual Leave' },
    { id: 'sick', label: 'Sick Leave' },
    { id: 'other', label: 'Other Leave' },
    // { id: 'unpaid', label: 'Unpaid Leave' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when the user changes it
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Client-side validation
    let validationErrors = {};
    
    if (!formData.start_date) {
      validationErrors.start_date = "Start date is required";
    }
    
    if (!formData.end_date) {
      validationErrors.end_date = "End date is required";
    }
    
    if (formData.start_date && formData.end_date) {
      const start_date = new Date(formData.start_date);
      const end_date = new Date(formData.end_date);
      
      if (end_date < start_date) {
        validationErrors.end_date = "End date cannot be before start date";
      }
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
      console.error("Leave request error:", error);
      
      // Parse and format API error responses
      if (typeof error === 'object' && error !== null) {
        const fieldErrors = {};
        
        // Extract error messages by field
        for (const [field, messages] of Object.entries(error)) {
          if (Array.isArray(messages)) {
            fieldErrors[field] = messages.join(', ');
          } else if (typeof messages === 'string') {
            fieldErrors[field] = messages;
          }
        }
        
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setErrors({ general: "Failed to submit leave request" });
        }
      } else {
        setErrors({ general: error.message || "Failed to submit leave request" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render error message for a field
  const renderError = (fieldName) => {
    if (errors[fieldName]) {
      return (
        <div className="text-red-500 text-sm mt-1">
          {errors[fieldName]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-medium">
      <h2 className="text-2xl font-bold mb-6">Apply for Leave</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="p-3 text-sm text-white bg-destructive rounded">
            {errors.general}
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
              className={`input-field w-full ${errors.leave_type ? 'border-red-500' : ''}`}
              required
            >
              {leaveTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
            {renderError('leave_type')}
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
              className={`input-field w-full ${errors.start_date ? 'border-red-500' : ''}`}
              required
              min={new Date().toISOString().split('T')[0]}
            />
            {renderError('start_date')}
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
              className={`input-field w-full ${errors.end_date ? 'border-red-500' : ''}`}
              required
              min={formData.start_date || new Date().toISOString().split('T')[0]}
            />
            {renderError('end_date')}
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
              className={`input-field w-full ${errors.contactInfo ? 'border-red-500' : ''}`}
              placeholder="Phone number or email"
            />
            {renderError('contactInfo')}
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
            className={`input-field w-full ${errors.reason ? 'border-red-500' : ''}`}
            placeholder="Please provide details about your leave request"
            required
          ></textarea>
          {renderError('reason')}
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