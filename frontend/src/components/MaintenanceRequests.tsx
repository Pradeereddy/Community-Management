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

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const response = await axios.get('/api/v1/maintenance-requests');
    setRequests(response.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest({ ...newRequest, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/v1/maintenance-requests', newRequest);
    fetchRequests(); // Refresh requests after adding
    setNewRequest({ resident_id: '', unit_number: '', request_description: '' });
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
          </div>
        ))}
      </div>
    </div>
  );
}
