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
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vehicles" element={<PrivateRoute><Vehicles /></PrivateRoute>} />
              <Route path="/vehicles/add" element={<PrivateRoute><AddVehicle /></PrivateRoute>} />
              <Route path="/vehicles/:id" element={<PrivateRoute><EditVehicle /></PrivateRoute>} />
              <Route path="/users/register" element={<Register />} />
              <Route path="/reservations/:vehicleId/damage" element={<PrivateRoute><ReportDamage /></PrivateRoute>} />
              <Route path="/vehicles/damaged" element={<PrivateRoute><DamageReport /></PrivateRoute>} />
              <Route path="/reservations" element={<PrivateRoute><AdminReservations /></PrivateRoute>} />
              <Route path="/reservations/new" element={<PrivateRoute><NewReservation /></PrivateRoute>} />
              <Route path="/reservations/:userId" element={<PrivateRoute><MyReservations /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
