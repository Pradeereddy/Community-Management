import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Complaint {
  complaint_id: number;
  resident_id: number;
  unit_number: string;
  complaint_type: 'Noise' | 'Maintenance' | 'Security' | 'Other';
  description: string;
  status: 'Submitted' | 'In_progress' | 'Resolved';
  date_submitted: string;
  date_resolved?: string;
}

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newComplaint, setNewComplaint] = useState({
    resident_id: '',
    unit_number: '',
    complaint_type: 'Noise' as 'Noise' | 'Maintenance' | 'Security' | 'Other',
    description: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewComplaint({ ...newComplaint, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/v1/complaints', newComplaint);
      fetchComplaints(); // Refresh complaints after adding
      setNewComplaint({ resident_id: '', unit_number: '', complaint_type: 'Noise', description: '' }); // Reset form
      setIsAdding(false); // Hide the form after submission
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const updateStatus = async (complaintId: number, newStatus: 'In_progress' | 'Resolved') => {
    try {
      await axios.put(`http://localhost:3000/api/v1/complaints/${complaintId}`, { status: newStatus });
      fetchComplaints(); // Refresh complaints after updating status
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'In_progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Noise': return '🔊';
      case 'Security': return '🔒';
      case 'Maintenance': return '🔧';
      case 'Other': return '📝';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          File Complaint
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6">
          <input type="text" name="resident_id" placeholder="Resident ID" value={newComplaint.resident_id} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="text" name="unit_number" placeholder="Unit Number" value={newComplaint.unit_number} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <select name="complaint_type" value={newComplaint.complaint_type} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required>
            <option value="Noise">Noise</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Security">Security</option>
            <option value="Other">Other</option>
          </select>
          <textarea name="description" placeholder="Description" value={newComplaint.description} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Submit Complaint</button>
        </form>
      )}

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <div 
            key={complaint.complaint_id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(complaint.complaint_type)}</span>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {complaint.complaint_type}
                  </h2>
                </div>
                <p className="text-gray-600 mt-2">{complaint.description}</p>
                <p className="text-sm text-gray-500 mt-1">Unit: {complaint.unit_number}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              <p>Submitted: {new Date(complaint.date_submitted).toLocaleString()}</p>
              {complaint.date_resolved && (
                <p>Resolved: {new Date(complaint.date_resolved).toLocaleString()}</p>
              )}
            </div>
            {complaint.status === 'Submitted' && (
              <button onClick={() => updateStatus(complaint.complaint_id, 'In_progress')} className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2">Start Processing</button>
            )}
            {complaint.status === 'In_progress' && (
              <button onClick={() => updateStatus(complaint.complaint_id, 'Resolved')} className="bg-green-500 text-white px-2 py-1 rounded-md mt-2">Mark as Resolved</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
