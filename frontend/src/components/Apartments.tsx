import React from 'react';


interface Apartment {
  apartment_id: number;
  building_name: string;
  unit_number: string;
  floor_number: number;
  number_of_rooms: number;
  status: 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';
}

export default function Apartments() {
  // Dummy data based on your schema
  const apartments: Apartment[] = [
    {
      apartment_id: 1,
      building_name: "Sunrise Tower",
      unit_number: "A101",
      floor_number: 1,
      number_of_rooms: 2,
      status: "OCCUPIED"
    },
    {
      apartment_id: 2,
      building_name: "Sunrise Tower",
      unit_number: "B205",
      floor_number: 2,
      number_of_rooms: 3,
      status: "VACANT"
    },
    {
      apartment_id: 3,
      building_name: "Sunset Heights",
      unit_number: "C304",
      floor_number: 3,
      number_of_rooms: 1,
      status: "MAINTENANCE"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VACANT': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Apartments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apartments.map((apartment) => (
          <div 
            key={apartment.apartment_id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Unit {apartment.unit_number}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(apartment.status)}`}>
                {apartment.status}
              </span>
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
