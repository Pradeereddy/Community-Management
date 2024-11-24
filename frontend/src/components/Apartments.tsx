import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Apartment {
  apartment_id: number;
  building_name: string;
  unit_number: string;
  floor_number: number;
  number_of_rooms: number;
  status: 'Vacant' | 'Occupied' | 'Maintanence';
}

export default function Apartments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [newApartment, setNewApartment] = useState<Partial<Apartment>>({});
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApartments();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user?.role);
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/apartments');
      setApartments(response.data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      setError('Failed to fetch apartments. Please try again later.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingApartment) {
      setEditingApartment({ ...editingApartment, [name]: value });
    } else {
      setNewApartment({ ...newApartment, [name]: value });
    }
  };

  const handleAddApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/v1/apartments', newApartment);
      fetchApartments();
      setNewApartment({});
      setError(null);
    } catch (error) {
      console.error('Error adding apartment:', error);
      setError('Failed to add apartment. Please try again.');
    }
  };

  const handleEditApartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApartment) {
      try {
        await axios.put(`http://localhost:3000/api/v1/apartments/${editingApartment.apartment_id}`, editingApartment);
        fetchApartments();
        setEditingApartment(null);
        setError(null);
      } catch (error) {
        console.error('Error updating apartment:', error);
        setError('Failed to update apartment. Please try again.');
      }
    }
  };

  const handleDeleteApartment = async (apartmentId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/apartments/${apartmentId}`);
      fetchApartments();
      setError(null);
    } catch (error) {
      console.error('Error deleting apartment:', error);
      setError('Failed to delete apartment. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vacant':
        return 'bg-green-100 text-green-800'; // Green for VACANT
      case 'Occupied':
        return 'bg-red-100 text-red-800'; // Red for OCCUPIED
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800'; // Yellow for MAINTENANCE
      default:
        return '';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Apartments</h1>
      {error && <p className="text-red-500">{error}</p>}
      {userRole === 'staff' && (
        <form onSubmit={editingApartment ? handleEditApartment : handleAddApartment} className="mb-6">
          <input type="text" name="building_name" placeholder="Building Name" value={editingApartment?.building_name || newApartment.building_name || ''} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="text" name="unit_number" placeholder="Unit Number" value={editingApartment?.unit_number || newApartment.unit_number || ''} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="number" name="floor_number" placeholder="Floor Number" value={editingApartment?.floor_number || newApartment.floor_number || ''} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <input type="number" name="number_of_rooms" placeholder="Number of Rooms" value={editingApartment?.number_of_rooms || newApartment.number_of_rooms || ''} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required />
          <select name="status" value={editingApartment?.status || newApartment.status || ''} onChange={handleInputChange} className="border rounded-md p-2 mb-2 w-full" required>
            <option value="">Select Status</option>
            <option value="Vacant">VACANT</option>
            <option value="Occupied">OCCUPIED</option>
            <option value="Maintenance">MAINTENANCE</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {editingApartment ? 'Update Apartment' : 'Add Apartment'}
          </button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apartments.map((apartment) => (
          <div key={apartment.apartment_id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative">
            <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apartment.status)}`}>
              {apartment.status}
            </span>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-700">Unit {apartment.unit_number}</h2>
              {userRole === 'staff' && (
                <div>
                  <button onClick={() => setEditingApartment(apartment)} className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDeleteApartment(apartment.apartment_id)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 ml-2">Delete</button>
                </div>
              )}
            </div>
            <div className="text-gray-600">
              <p><span className="font-medium">Building:</span> {apartment.building_name}</p>
              <p><span className="font-medium">Floor:</span> {apartment.floor_number}</p>
              <p><span className="font-medium">Rooms:</span> {apartment.number_of_rooms}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
