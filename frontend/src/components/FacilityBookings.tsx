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
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserRole(user?.role);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/facilities');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error(err);
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: 'Approved' | 'Rejected') => {
    await axios.put(`http://localhost:3000/api/v1/facilities/${bookingId}/updateStatus`, { status, user_role: currentUserRole });
    fetchBookings(); // Refresh bookings after status update
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Facility Bookings</h1>
      {error && <p className="text-red-500">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.booking_id} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold text-gray-700">{booking.facility_name}</h2>
              <p>Unit: {booking.unit_number}</p>
              <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
              <p>Time: {booking.start_time} - {booking.end_time}</p>
              <p>Status: {booking.status}</p>
              {currentUserRole === 'staff' && (
                <div className="flex space-x-2">
                  <button onClick={() => handleUpdateStatus(booking.booking_id, 'Approved')} className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700">Approve</button>
                  <button onClick={() => handleUpdateStatus(booking.booking_id, 'Rejected')} className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 