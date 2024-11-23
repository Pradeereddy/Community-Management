import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface FacilityBooking {
  booking_id: number;
  facility_name: string;
  resident_id: number;
  unit_number: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export default function FacilityBookings() {
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);
  const [newBooking, setNewBooking] = useState({
    resident_id: '',
    unit_number: '',
    facility_name: '',
    booking_date: '',
    start_time: '',
    end_time: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const response = await axios.get('/api/v1/facilities');
    setBookings(response.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/v1/facilities/:id/book', newBooking);
    fetchBookings(); // Refresh bookings after adding
    setNewBooking({ resident_id: '', unit_number: '', facility_name: '', booking_date: '', start_time: '', end_time: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Facility Bookings</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <input type="text" name="resident_id" placeholder="Resident ID" value={newBooking.resident_id} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="text" name="unit_number" placeholder="Unit Number" value={newBooking.unit_number} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="text" name="facility_name" placeholder="Facility Name" value={newBooking.facility_name} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="date" name="booking_date" value={newBooking.booking_date} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="time" name="start_time" value={newBooking.start_time} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="time" name="end_time" value={newBooking.end_time} onChange={handleInputChange} className="border rounded-md p-2" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Create Booking</button>
        </div>
      </form>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.booking_id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-700">{booking.facility_name}</h2>
            <p>Unit: {booking.unit_number}</p>
            <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
            <p>Time: {booking.start_time} - {booking.end_time}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 