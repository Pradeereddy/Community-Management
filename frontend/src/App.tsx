import { BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfile from './components/UserProfile';
import Announcements from './components/Announcements';
import ParkingSlots from './components/ParkingSlots';
import Visitors from './components/Visitors';
import Complaints from './components/Complaints';
import MaintenanceRequests from './components/MaintenanceRequests';
import Events from './components/Events';
import Apartments from './components/Apartments';
import Login from './components/LoginPage';
import FacilityBookings from './components/FacilityBookings';
// Import other page components

// Add auth context or hook import
// import { useAuth } from './contexts/AuthContext'; // You'll need to create this

function App() {
  // const { isAuthenticated } = useAuth(); // Add this line

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={<HomePage/>}
        >
          <Route path="profile" element={<UserProfile />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="parking" element={<ParkingSlots />} />
          <Route path="visitors" element={<Visitors />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="maintenance" element={<MaintenanceRequests />} />
          <Route path="events" element={<Events />} />
          <Route path="facilities" element={<FacilityBookings />} />
          <Route path="apartments" element={<Apartments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
