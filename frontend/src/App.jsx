import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Importaj UserProvider
import Login from './pages/Login';
import Vehicles from './pages/Vehicles';
import Home from './pages/Home';
import Profile from './pages/Profile'; // Ako imaš stranicu za profil korisnika
import PrivateRoute from './components/PrivateRoute'; // Komponenta za zaštitu ruta

const App = () => {
  return (
    <UserProvider> {/* Omotaj aplikaciju s UserProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Zaštićene rute */}
          <Route 
            path="/vehicles" 
            element={<PrivateRoute><Vehicles /></PrivateRoute>} 
          />
          <Route 
            path="/profile" 
            element={<PrivateRoute><Profile /></PrivateRoute>} 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
