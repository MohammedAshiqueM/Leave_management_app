import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toggleLeaveStatus } from "../../api/admin_api";

const LeaveTable = ({ mode, data, activeTab }) => {
  const { currentUser, isAdmin } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [rejectReasonOpen, setRejectReasonOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    console.log(activeTab)
    if (data) {
      setLeaveRequests(data);
    }
    setLoading(false);
  }, [data]);

  const handleActionClick = (leave, action) => {
    setSelectedLeave(leave);
    setActionType(action);
    if (action === "approve") {
      setConfirmationOpen(true);
    } else if (action === "reject") {
      setRejectReasonOpen(true);
      setRejectReason("");
    }
  };

  const handleViewReason = (leave) => {
    setSelectedLeave(leave);
    setReasonModalOpen(true);
  };

  const handleStatusChange = async (leaveId, newStatus, reason = null) => {
    try {
      const leaveToUpdate = leaveRequests.find((leave) => leave.id === leaveId);
      if (!leaveToUpdate) {
        console.error(`Leave with ID ${leaveId} not found`);
        return;
      }

      const updatedLeaveData = {
        ...leaveToUpdate,
        status: newStatus,
        reason_not_approved: reason || null,
      };

      const response = await toggleLeaveStatus(leaveId, updatedLeaveData);
      if (response) {
        setLeaveRequests((prev) =>
          prev.map((leave) =>
            leave.id === leaveId
              ? { ...leave, status: newStatus, reason_not_approved: reason }
              : leave
          )
        );
        setConfirmationOpen(false);
        setRejectReasonOpen(false);
      }
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  const handleConfirmApprove = () => {
    if (selectedLeave) {
      handleStatusChange(selectedLeave.id, "approved");
    }
  };

  const handleConfirmReject = () => {
    if (selectedLeave && rejectReason.trim()) {
      handleStatusChange(selectedLeave.id, "rejected", rejectReason);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to truncate text for table display
  const truncateText = (text, maxLength = 30) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (loading) {
    return <div className="p-4 text-center animate-pulse">Loading leave requests...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {mode === "admin" && <th className="p-3 text-left text-gray-600">Employee</th>}
              <th className="p-3 text-left text-gray-600">Leave Type</th>
              <th className="p-3 text-left text-gray-600">From</th>
              <th className="p-3 text-left text-gray-600">To</th>
              <th className="p-3 text-left text-gray-600">Status</th>
              <th className="p-3 text-left text-gray-600">Leave Reason</th>
              {activeTab === 'rejected' && <th className="p-3 text-left text-gray-600">Rejection Reason</th>}
              {mode === "admin" && activeTab === 'pending' && <th className="p-3 text-left text-gray-600">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="border-t">
                {mode === "admin" && (
                  <td className="p-3">
                    <div className="font-semibold">{leave.user?.username}</div>
                    <div className="text-sm text-gray-500">{leave.department}</div>
                  </td>
                )}
                <td className="p-3 capitalize">{leave.leave_type}</td>
                <td className="p-3">{leave.start_date.split("T")[0]}</td>
                <td className="p-3">{leave.end_date.split("T")[0]}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="p-3">
                  <div 
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleViewReason(leave)}
                  >
                    {truncateText(leave.reason)}
                  </div>
                </td>
                {activeTab === 'rejected' && (
                  <td className="p-3">
                    {leave.reason_not_approved && (
                      <div 
                        className="cursor-pointer text-blue-600 hover:underline"
                        onClick={() => handleViewReason(leave)}
                      >
                        {truncateText(leave.reason_not_approved)}
                      </div>
                    )}
                  </td>
                )}
                {mode === "admin" && activeTab === 'pending' && (
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs"
                        onClick={() => handleActionClick(leave, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs"
                        onClick={() => handleActionClick(leave, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve Modal */}
      {confirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2">Confirm Leave Approval</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to approve this leave request?</p>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setConfirmationOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleConfirmApprove}>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectReasonOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50">
          <div className="bg-white p-5 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2">Reject Leave Request</h2>
            <p className="text-sm text-gray-600 mb-4">Provide a reason for rejection:</p>
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setRejectReasonOpen(false)}>
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reason View Modal */}
      {reasonModalOpen && selectedLeave && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50">
          <div className="bg-white p-5 rounded shadow-lg w-96 max-w-lg">
            <h2 className="text-lg font-semibold mb-2">
              {selectedLeave.status === "rejected" ? "Leave Details" : "Leave Reason"}
            </h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Leave Reason:</h3>
              <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">{selectedLeave.reason || "No reason provided"}</p>
            </div>
            
            {selectedLeave.status === "rejected" && selectedLeave.reason_not_approved && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-700">Rejection Reason:</h3>
                <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded">{selectedLeave.reason_not_approved}</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setReasonModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaveTable;