import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get('/api/v1/events');
    setEvents(response.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('/api/v1/events', newEvent);
    fetchEvents(); // Refresh events after adding
    setNewEvent({ event_name: '', description: '', event_date: '', start_time: '', end_time: '', location: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800">Community Events</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 gap-4">
          <input type="text" name="event_name" placeholder="Event Name" value={newEvent.event_name} onChange={handleInputChange} className="border rounded-md p-2" required />
          <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="date" name="event_date" value={newEvent.event_date} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="time" name="start_time" value={newEvent.start_time} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="time" name="end_time" value={newEvent.end_time} onChange={handleInputChange} className="border rounded-md p-2" required />
          <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={handleInputChange} className="border rounded-md p-2" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Create Event</button>
        </div>
      </form>
      <div className="grid gap-4">
        {events.map((event) => (
          <div key={event.event_id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-700">{event.event_name}</h2>
            <p>Description: {event.description}</p>
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <p>Time: {event.start_time} - {event.end_time}</p>
            <p>Location: {event.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
