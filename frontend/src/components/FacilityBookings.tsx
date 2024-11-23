import React, { useState } from 'react';

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
  const [bookings] = useState<FacilityBooking[]>([
    {
      booking_id: 1,
      facility_name: "Gym",
      resident_id: 1,
      unit_number: "A101",
      booking_date: "2024-03-16",
      start_time: "09:00",
      end_time: "10:00",
      status: "Approved"
    },
    {
      booking_id: 2,
      facility_name: "Tennis Court",
      resident_id: 2,
      unit_number: "B205",
      booking_date: "2024-03-17",
      start_time: "16:00",
      end_time: "17:00",
      status: "Pending"
    },
    {
      booking_id: 3,
      facility_name: "Function Hall",
      resident_id: 3,
      unit_number: "C304",
      booking_date: "2024-03-20",
      start_time: "14:00",
      end_time: "18:00",
      status: "Approved"
    }
  ]);

  const facilities = [
    "Gym",
    "Swimming Pool",
    "Tennis Court",
    "Function Hall",
    "BBQ Pit"
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Facility Bookings</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Booking
        </button>
      </div>

      {/* Quick Facility Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100">
          All
        </button>
        {facilities.map((facility) => (
          <button 
            key={facility}
            className="bg-gray-50 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 whitespace-nowrap"
          >
            {facility}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div 
            key={booking.booking_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {booking.facility_name}
                </h2>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Unit:</span> {booking.unit_number}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span> {booking.start_time} - {booking.end_time}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                {booking.status === 'Approved' && (
                  <button className="text-red-600 text-sm hover:text-red-700">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 