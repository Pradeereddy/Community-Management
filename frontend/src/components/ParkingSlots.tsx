import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ParkingSlot {
  parking_slot_id: number;
  slot_number: string;
  status: 'Occupied' | 'Vacant';
  assigned_to_resident?: number;
  assigned_to_unit?: string;
}

export default function ParkingSlots() {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [userId, setUserId] = useState<number | null>(null); // Assume you get the user ID from context or props

  useEffect(() => {
    fetchParkingSlots();
    // Fetch user ID from context or API if needed
    setUserId(JSON.parse(localStorage.getItem('user') || "")?.user_id);
  }, []);

  const fetchParkingSlots = async () => {
    const response = await axios.get('http://localhost:3000/api/v1/parking-slots');
    setParkingSlots(response.data);
  };

  const handleUnassign = async (slotId: number) => {
    await axios.post('http://localhost:3000/api/v1/parking-slots/unassign', { slot_id: slotId, user_id: userId });
    fetchParkingSlots(); // Refresh slots after unassigning
  };

  const handleAssign = async (slotId: number) => {
    await axios.post('http://localhost:3000/api/v1/parking-slots/assign', { slot_id: slotId, user_id: userId });
    fetchParkingSlots(); // Refresh slots after assigning
  };

  const getStatusColor = (status: string) => {
    return status === 'Vacant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Parking Slots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parkingSlots.map((slot) => (
          <div key={slot.parking_slot_id} className="rounded-lg shadow-md p-4 bg-white">
            <h2 className={`text-xl font-semibold text-gray-700 ${getStatusColor(slot.status)}`}>Slot {slot.slot_number}</h2>
            <p className={`p-2 rounded-md `}>Status: {slot.status}</p>
            {slot.assigned_to_unit ? (
              <p>Assigned to Unit: {slot.assigned_to_unit}</p>
            ) : (
              <p>No unit assigned</p>
            )}
            {slot.status === 'Vacant' ? (
              <button onClick={() => handleAssign(slot.parking_slot_id)} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Assign to Me
              </button>
            ) : (
              slot.assigned_to_resident === userId && (
                <button onClick={() => handleUnassign(slot.parking_slot_id)} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  Unassign
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
