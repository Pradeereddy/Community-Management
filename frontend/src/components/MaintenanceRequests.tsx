import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MaintenanceRequest {
  request_id: number;
  unit_number: string;
  request_description: string;
  status: 'Open' | 'In_progress' | 'Completed';
  date_submitted: string;
  date_resolved?: string;
}

export default function MaintenanceRequests() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [newRequest, setNewRequest] = useState({
    resident_id: '',
    unit_number: '',
    request_description: ''
  });
  const [statusUpdate, setStatusUpdate] = useState<{ id: number; status: string } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
    getUserRole(); // Fetch user role on component mount
  }, []);

  const fetchRequests = async () => {
    const response = await axios.get('http://localhost:3000/api/v1/maintenance-requests');
    setRequests(response.data);
  };

  const getUserRole = () => {
    const token = localStorage.getItem('user'); // Adjust the key based on your implementation
    if (token) {
      const user = JSON.parse(token); // Decode the token to get user info
      setUserRole(user.role); // Assuming the role is stored in the token
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/api/v1/maintenance-requests', newRequest);
    fetchRequests(); // Refresh requests after adding
    setNewRequest({ resident_id: '', unit_number: '', request_description: '' });
  };

  const handleStatusChange = async (requestId: number) => {
    if (statusUpdate) {
      await axios.put(`http://localhost:3000/api/v1/maintenance-requests/${requestId}/status`, { status: statusUpdate.status });
      fetchRequests(); // Refresh requests after updating status
      setStatusUpdate(null); // Reset status update
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Maintenance Requests</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <input type="text" name="resident_id" placeholder="Resident ID" value={newRequest.resident_id} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="text" name="unit_number" placeholder="Unit Number" value={newRequest.unit_number} onChange={handleInputChange} className="border rounded-md p-2" required />
          <textarea name="request_description" placeholder="Request Description" value={newRequest.request_description} onChange={handleInputChange} className="border rounded-md p-2" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Create Request</button>
        </div>
      </form>
      <div className="grid gap-4">
        {requests.map((request) => (
          <div key={request.request_id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-700">Unit: {request.unit_number}</h2>
            <p>Description: {request.request_description}</p>
            <p>Status: {request.status}</p>
            <p>Submitted: {new Date(request.date_submitted).toLocaleDateString()}</p>
            <select
              value={statusUpdate?.status || request.status}
              onChange={(e) => setStatusUpdate({ id: request.request_id, status: e.target.value })}
              className="border rounded-md p-2"
            >
              <option value="Open">Open</option>
              <option value="In_progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button 
              onClick={() => handleStatusChange(request.request_id)} 
              className={`px-4 py-2 rounded-md ${userRole === 'staff' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} 
              disabled={userRole !== 'staff'} // Disable button if user is not staff
            >
              Update Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
