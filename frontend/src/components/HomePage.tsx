import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FaUser, FaBullhorn, FaCar, FaUsers, FaExclamationCircle, 
         FaTools, FaCalendarAlt, FaBuilding, FaHome, FaSignOutAlt } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';

export default function HomePage() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Community Portal</h1>
        </div>
        
        <div className="py-4">
          <NavItem to="/profile" icon={<FaUser />} text="User Profile" />
          <NavItem to="/announcements" icon={<FaBullhorn />} text="Announcements" />
          <NavItem to="/parking" icon={<FaCar />} text="Parking Slots" />
          <NavItem to="/visitors" icon={<FaUsers />} text="Visitors" />
          <NavItem to="/complaints" icon={<FaExclamationCircle />} text="Complaints" />
          <NavItem to="/maintenance" icon={<FaTools />} text="Maintenance Requests" />
          <NavItem to="/events" icon={<FaCalendarAlt />} text="Events" />
          <NavItem to="/facilities" icon={<FaBuilding />} text="FacilityBookings" />
          <NavItem to="/apartments" icon={<FaHome />} text="Apartments" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

 
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

const NavItem = ({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  >
    <span className="mr-3">{icon}</span>
    <span>{text}</span>
  </Link>
);
