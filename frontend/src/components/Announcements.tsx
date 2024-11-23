import React, { useState } from 'react';

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
  const [announcements] = useState<Announcement[]>([
    {
      announcement_id: 1,
      title: "Building Maintenance Schedule",
      description: "Annual maintenance work will be carried out next week. Water supply might be interrupted.",
      is_urgent: true,
      posted_by: 1,
      date_posted: "2024-03-15T09:00:00",
      expiry_date: "2024-03-22T09:00:00"
    },
    {
      announcement_id: 2,
      title: "Community Meeting",
      description: "Monthly community meeting this Sunday at 10 AM in the community hall.",
      is_urgent: false,
      posted_by: 1,
      date_posted: "2024-03-14T14:30:00",
      expiry_date: "2024-03-17T10:00:00"
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Announcement
        </button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <div 
            key={announcement.announcement_id}
            className={`bg-white rounded-lg shadow-md p-4 ${
              announcement.is_urgent ? 'border-l-4 border-red-500' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-700">
                    {announcement.title}
                  </h2>
                  {announcement.is_urgent && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{announcement.description}</p>
              </div>
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
