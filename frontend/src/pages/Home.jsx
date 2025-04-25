import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        console.log("Decoded token:", decoded); 
      } catch (err) {
        console.error('Greška prilikom dekodiranja tokena:', err);
      }
    }
  }, [user]); // ponovno dekodiraj kad se `user` promijeni

  const handleGoToReservations = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      navigate(`/reservations/${userId}`);
    }
  };
/* 
  const handleAuthClick = () => {
    if (user) {
      logoutUser();
      navigate('/login');
    } else {
      navigate('/login');
    }
  }; */

  if (!user && localStorage.getItem('token')) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="home-container">
{/*       <button onClick={handleAuthClick}>
        {user ? 'Odjava' : 'Prijava'}
      </button> */}

      <h1>Dobro došli u sustav za upravljanje voznim parkom</h1>
      <p>Ovdje možete upravljati vozilima, rezervacijama, i pregledavati status vaših zahtjeva.</p>

      <div className="actions">
        <button onClick={() => window.location.href = '/vehicles'}>
          Pregledaj vozila
        </button>

        {role === 'admin' && (
          <>
            <button onClick={() => window.location.href = '/vehicles/add'}>Dodaj vozilo</button>
            <button onClick={() => window.location.href = '/vehicles/damaged'}>Prijavljena šteta</button>
            <button onClick={() => window.location.href = '/reservations'}>Sve rezervacije (odobri/odbij)</button>
          </>
        )}

        {role === 'employee' && (
          <>
            <button onClick={() => navigate('/reservations/new')}>Kreiraj novu rezervaciju</button>
            <button onClick={handleGoToReservations}>Pogledaj moje rezervacije</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
