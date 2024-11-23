import React, { useState } from 'react';

interface Event {
  event_id: number;
  event_name: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  organized_by: number;
  max_participants: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export default function Events() {
  const [events] = useState<Event[]>([
    {
      event_id: 1,
      event_name: "Summer Pool Party",
      description: "Annual community pool party with games and refreshments",
      event_date: "2024-06-15",
      start_time: "14:00",
      end_time: "18:00",
      location: "Community Pool",
      organized_by: 1,
      max_participants: 50,
      status: "Upcoming"
    },
    {
      event_id: 2,
      event_name: "Fitness Workshop",
      description: "Learn about health and wellness from certified trainers",
      event_date: "2024-03-20",
      start_time: "10:00",
      end_time: "12:00",
      location: "Community Hall",
      organized_by: 2,
      max_participants: 30,
      status: "Upcoming"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Community Events</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Create Event
        </button>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div 
            key={event.event_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  {event.event_name}
                </h2>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <div className="mt-4 space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(event.event_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span> {event.start_time} - {event.end_time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Capacity:</span> {event.max_participants} participants
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <div className="mt-4">
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100">
                Register
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
