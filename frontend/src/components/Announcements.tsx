import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Announcement {
  announcement_id: number;
  title: string;
  description: string;
  is_urgent: boolean;
  posted_by: number;
  unit_number?: string;
  date_posted: string;
  expiry_date?: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    is_urgent: false,
    unit_number: '',
    expiry_date: ''
  });
  const currentUserId = JSON.parse(localStorage.getItem('user') || "")?.user_id;  
  const currentUserRole = JSON.parse(localStorage.getItem('user') || "")?.role; 

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const response = await axios.get('http://localhost:3000/api/v1/announcements');
    setAnnouncements(response.data);
  };

  const handleDelete = async (announcementId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-announcement/${announcementId}`);
      fetchAnnouncements(); // Refresh announcements after deletion
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsEditing(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAnnouncement) {
      try {
        await axios.put(`http://localhost:3000/api/v1/edit-announcement/${currentAnnouncement.announcement_id}`, currentAnnouncement);
        fetchAnnouncements(); // Refresh announcements after editing
        setIsEditing(false);
        setCurrentAnnouncement(null);
      } catch (error) {
        console.error('Error updating announcement:', error);
      }
    }
  };

  const handleNewAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAnnouncement({ ...newAnnouncement, [name]: value });
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/v1/create-announcement', {
        ...newAnnouncement,
        posted_by: currentUserId
      });
      fetchAnnouncements(); // Refresh announcements after creating
      setNewAnnouncement({ title: '', description: '', is_urgent: false, unit_number: '', expiry_date: '' }); // Reset form
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
        <button onClick={() => setIsEditing(false)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Announcement
        </button>
      </div>

      <form onSubmit={handleCreateAnnouncement} className="mb-6">
        <input
          type="text"
          name="title"
          value={newAnnouncement.title}
          onChange={handleNewAnnouncementChange}
          placeholder="Title"
          className="border rounded-md p-2 mb-2 w-full"
          required
        />
        <textarea
          name="description"
          value={newAnnouncement.description}
          onChange={handleNewAnnouncementChange}
          placeholder="Description"
          className="border rounded-md p-2 mb-2 w-full"
          required
        />
        <label>
          <input
            type="checkbox"
            name="is_urgent"
            checked={newAnnouncement.is_urgent}
            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, is_urgent: e.target.checked })}
          />
          Urgent
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mx-2">Create Announcement</button>
      </form>

      {isEditing && currentAnnouncement && (
        <form onSubmit={handleUpdate} className="mb-6">
          <input
            type="text"
            value={currentAnnouncement.title}
            onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
            className="border rounded-md p-2 mb-2 w-full"
            required
          />
          <textarea
            value={currentAnnouncement.description}
            onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, description: e.target.value })}
            className="border rounded-md p-2 mb-2 w-full"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Update Announcement</button>
          <button type="button" onClick={() => setIsEditing(false)} className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
        </form>
      )}

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <div 
            key={announcement.announcement_id}
            className={`bg-white rounded-lg shadow-md p-4 ${announcement.is_urgent ? 'border-l-4 border-red-500' : ''}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-700">{announcement.title}</h2>
                  {announcement.is_urgent && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{announcement.description}</p>
              </div>
              {(announcement.posted_by === currentUserId || currentUserRole === 'staff') && (
                <div>
                  <button onClick={() => handleEdit(announcement)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                  <button onClick={() => handleDelete(announcement.announcement_id)} className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Posted: {new Date(announcement.date_posted).toLocaleDateString()}</p>
              {announcement.expiry_date && (
                <p>Expires: {new Date(announcement.expiry_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
