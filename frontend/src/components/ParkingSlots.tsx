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
  const [newSlot, setNewSlot] = useState({
    slot_number: '',
    status: 'Vacant'
  });

  useEffect(() => {
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = async () => {
    const response = await axios.get('/api/v1/parking-slots');
    setParkingSlots(response.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSlot({ ...newSlot, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/v1/parking-slots', newSlot);
    fetchParkingSlots(); // Refresh slots after adding
    setNewSlot({ slot_number: '', status: 'Vacant' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Parking Slots</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <input type="text" name="slot_number" placeholder="Slot Number" value={newSlot.slot_number} onChange={handleInputChange} className="border rounded-md p-2" required />
          <select name="status" value={newSlot.status} onChange={handleInputChange} className="border rounded-md p-2">
            <option value="Vacant">Vacant</option>
            <option value="Occupied">Occupied</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add Parking Slot</button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parkingSlots.map((slot) => (
          <div key={slot.parking_slot_id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-700">Slot {slot.slot_number}</h2>
            <p>Status: {slot.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
