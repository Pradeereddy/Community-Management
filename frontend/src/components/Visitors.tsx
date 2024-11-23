import React, { useState } from 'react';

interface Visitor {
  visitor_id: number;
  visitor_name: string;
  contact_number: string;
  purpose_of_visit: string;
  unit_number: string;
  entry_time: string;
  exit_time?: string;
  approved_by?: number;
}

export default function Visitors() {
  const [visitors] = useState<Visitor[]>([
    {
      visitor_id: 1,
      visitor_name: "John Smith",
      contact_number: "123-456-7890",
      purpose_of_visit: "Family Visit",
      unit_number: "A101",
      entry_time: "2024-03-15T14:00:00",
      exit_time: "2024-03-15T16:00:00",
      approved_by: 1
    },
    {
      visitor_id: 2,
      visitor_name: "Sarah Johnson",
      contact_number: "098-765-4321",
      purpose_of_visit: "Maintenance Work",
      unit_number: "B205",
      entry_time: "2024-03-15T10:00:00",
      approved_by: 2
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Visitors Log</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Register New Visitor
        </button>
      </div>

      <div className="grid gap-4">
        {visitors.map((visitor) => (
          <div 
            key={visitor.visitor_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {visitor.visitor_name}
                </h2>
                <p className="text-gray-600">Unit: {visitor.unit_number}</p>
                <p className="text-gray-600">Contact: {visitor.contact_number}</p>
                <p className="text-gray-600">Purpose: {visitor.purpose_of_visit}</p>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  !visitor.exit_time ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {!visitor.exit_time ? 'Currently Present' : 'Checked Out'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Entry: {new Date(visitor.entry_time).toLocaleString()}</p>
              {visitor.exit_time && (
                <p>Exit: {new Date(visitor.exit_time).toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
