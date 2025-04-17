import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Vehicles from './pages/Vehicles';
import EditVehicle from './pages/EditVehicle';  
import Register from './pages/Register';
import DamageReport from './pages/DamageReport'; 
import NewReservation from './pages/NewReservation';
import ReportDamage from './pages/ReportDamage';
import AdminReservations from './pages/AllReservationsAdmin';
import MyReservations from './pages/MyReservations';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import AddVehicle from './pages/AddVehicle';
import { useUser } from './context/UserContext';

const Header = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <header><div className="user-email">Loading...</div></header>;
  }

  return (
    <header>
      <div className="user-email">
        {user ? (
          <span>{user.email}</span> 
        ) : (
          <span>Not logged in</span> 
        )}
      </div>
    </header>
  );
};


const App = () => {
  return (
    <UserProvider> {/* Omotaj aplikaciju s UserProvider */}
      <Router>
        <Header />  {/* Prikazivanje e-maila na vrhu stranice */}
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Home
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* ZAŠTITITI RUTE */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/vehicles" 
            element={<PrivateRoute><Vehicles /></PrivateRoute>} 
          />
          <Route path="/vehicles/add" element={<PrivateRoute><AddVehicle /></PrivateRoute>} /> 
          <Route path="/vehicles/:id" element={<EditVehicle />} /> 
          <Route path="/users/register" element={<Register />} /> 
          <Route path="/reservations/:vehicleId/damage" element={<ReportDamage />} />
          <Route path="/vehicles/damaged" element={<PrivateRoute><DamageReport /></PrivateRoute>} /> 
          <Route path="/reservations" element={<AdminReservations />} />
          <Route path="/reservations/new" element={<NewReservation />} />
          <Route path="/reservations/:userId" element={<MyReservations />} />        
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
