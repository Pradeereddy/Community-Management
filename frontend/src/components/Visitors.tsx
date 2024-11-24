import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Visitor {
  visitor_id: number;
  visitor_name: string;
  contact_number: string;
  purpose_of_visit: string;
  unit_number: string;
  entry_time: string;
  exit_time?: string;
  approved_by?: number;
}

const Visitors: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [newVisitor, setNewVisitor] = useState({
    visitor_name: '',
    contact_number: '',
    purpose_of_visit: '',
    unit_number: ''
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentUserUnit, setCurrentUserUnit] = useState<string | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '');
    setCurrentUserId(user?.user_id);
    setCurrentUserRole(user?.role);
    setCurrentUserUnit(user?.unit_number);
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/visitors');
      setVisitors(response.data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVisitor({ ...newVisitor, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/v1/visitor', newVisitor);
      fetchVisitors(); // Refresh visitors after adding
      setNewVisitor({ visitor_name: '', contact_number: '', purpose_of_visit: '', unit_number: '' }); // Reset form
    } catch (error) {
      console.error('Error adding visitor:', error);
    }
  };

  const handleApprove = async (visitorId: number) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/visitors/${visitorId}/approve`, { user_id: currentUserId });
      fetchVisitors(); // Refresh visitors after approving
    } catch (error) {
      console.error('Error approving visitor:', error);
    }
  };

  const handleExit = async (visitorId: number) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/visitors/${visitorId}`, { user_id: currentUserId });
      fetchVisitors(); // Refresh visitors after marking exit
    } catch (error) {
      console.error('Error marking exit:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Visitors Log</h1>
        {currentUserRole === 'staff' && (
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Register New Visitor
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6">
          <input type="text" name="visitor_name" placeholder="Visitor Name" value={newVisitor.visitor_name} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="text" name="contact_number" placeholder="Contact Number" value={newVisitor.contact_number} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="text" name="purpose_of_visit" placeholder="Purpose of Visit" value={newVisitor.purpose_of_visit} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="text" name="unit_number" placeholder="Unit Number" value={newVisitor.unit_number} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register Visitor</button>
        </form>
      )}

      <div className="grid gap-4">
        {visitors.map((visitor) => (
          <div key={visitor.visitor_id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-700">{visitor.visitor_name}</h2>
            <p className="text-gray-600">Unit: {visitor.unit_number}</p>
            <p className="text-gray-600">Contact: {visitor.contact_number}</p>
            <p className="text-gray-600">Purpose: {visitor.purpose_of_visit}</p>
            <p className="text-gray-600">Entry: {new Date(visitor.entry_time).toLocaleString()}</p>
            {visitor.exit_time && <p className="text-gray-600">Exit: {new Date(visitor.exit_time).toLocaleString()}</p>}
            <div className="flex justify-between mt-4">
              {currentUserRole === 'staff' && !visitor.exit_time && (
                <button onClick={() => handleExit(visitor.visitor_id)} className="text-red-600 hover:text-red-800">Mark Exit</button>
              )}
              {currentUserRole === 'resident' && !visitor.approved_by && visitor.unit_number === currentUserUnit && (
                <button onClick={() => handleApprove(visitor.visitor_id)} className="text-green-600 hover:text-green-800">Approve</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visitors;
