import React, { useState } from 'react';

interface MaintenanceRequest {
  request_id: number;
  unit_number: string;
  request_description: string;
  status: 'Open' | 'In_progress' | 'Completed';
  date_submitted: string;
  date_resolved?: string;
}

export default function MaintenanceRequests() {
  // Dummy data based on your schema
  const [requests] = useState<MaintenanceRequest[]>([
    {
      request_id: 1,
      unit_number: "A101",
      request_description: "Leaking faucet in kitchen",
      status: "Open",
      date_submitted: "2024-03-15T10:00:00",
    },
    {
      request_id: 2,
      unit_number: "B205",
      request_description: "AC not working properly",
      status: "In_progress",
      date_submitted: "2024-03-14T15:30:00",
    },
    {
      request_id: 3,
      unit_number: "C304",
      request_description: "Light fixture replacement needed",
      status: "Completed",
      date_submitted: "2024-03-13T09:15:00",
      date_resolved: "2024-03-14T14:20:00",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In_progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Maintenance Requests</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Request
        </button>
      </div>
      
      <div className="grid gap-4">
        {requests.map((request) => (
          <div 
            key={request.request_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Unit {request.unit_number}
                </h2>
                <p className="text-gray-600 mt-1">{request.request_description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <p>Submitted: {new Date(request.date_submitted).toLocaleDateString()}</p>
              {request.date_resolved && (
                <p>Resolved: {new Date(request.date_resolved).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
