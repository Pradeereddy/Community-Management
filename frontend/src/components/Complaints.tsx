import React, { useState } from 'react';

interface Complaint {
  complaint_id: number;
  resident_id: number;
  unit_number: string;
  complaint_type: 'Noise' | 'Maintenance' | 'Security' | 'Other';
  description: string;
  status: 'Submitted' | 'In_progress' | 'Resolved';
  date_submitted: string;
  date_resolved?: string;
}

export default function Complaints() {
  const [complaints] = useState<Complaint[]>([
    {
      complaint_id: 1,
      resident_id: 1,
      unit_number: "A101",
      complaint_type: "Noise",
      description: "Loud music from unit above after 11 PM",
      status: "Submitted",
      date_submitted: "2024-03-15T22:30:00"
    },
    {
      complaint_id: 2,
      resident_id: 2,
      unit_number: "B205",
      complaint_type: "Security",
      description: "Main gate security camera not working",
      status: "In_progress",
      date_submitted: "2024-03-14T09:15:00"
    },
    {
      complaint_id: 3,
      resident_id: 3,
      unit_number: "C304",
      complaint_type: "Maintenance",
      description: "Water leakage from ceiling",
      status: "Resolved",
      date_submitted: "2024-03-13T14:20:00",
      date_resolved: "2024-03-14T16:30:00"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'In_progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Noise': return '🔊';
      case 'Security': return '🔒';
      case 'Maintenance': return '🔧';
      case 'Other': return '📝';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          File Complaint
        </button>
      </div>

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <div 
            key={complaint.complaint_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(complaint.complaint_type)}</span>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {complaint.complaint_type}
                  </h2>
                </div>
                <p className="text-gray-600 mt-2">{complaint.description}</p>
                <p className="text-sm text-gray-500 mt-1">Unit: {complaint.unit_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Submitted: {new Date(complaint.date_submitted).toLocaleString()}</p>
              {complaint.date_resolved && (
                <p>Resolved: {new Date(complaint.date_resolved).toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
