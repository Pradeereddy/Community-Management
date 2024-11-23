import React, { useState } from 'react';

interface ParkingSlot {
  parking_slot_id: number;
  slot_number: string;
  status: 'Occupied' | 'Vacant';
  assigned_to_resident?: number;
  assigned_to_unit?: string;
}

export default function ParkingSlots() {
  const [parkingSlots] = useState<ParkingSlot[]>([
    {
      parking_slot_id: 1,
      slot_number: "P101",
      status: "Occupied",
      assigned_to_resident: 1,
      assigned_to_unit: "A101"
    },
    {
      parking_slot_id: 2,
      slot_number: "P102",
      status: "Vacant"
    },
    {
      parking_slot_id: 3,
      slot_number: "P103",
      status: "Occupied",
      assigned_to_resident: 3,
      assigned_to_unit: "B205"
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Parking Slots</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Manage Assignments
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parkingSlots.map((slot) => (
          <div 
            key={slot.parking_slot_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold text-gray-700">
                Slot {slot.slot_number}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                slot.status === 'Vacant' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {slot.status}
              </span>
            </div>
            {slot.assigned_to_unit && (
              <div className="mt-2">
                <p className="text-gray-600">Assigned to Unit: {slot.assigned_to_unit}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
