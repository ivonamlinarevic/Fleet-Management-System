import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); 
        setRole(decoded.role);

        console.log('Uloga korisnika:', decoded.role); 
      } catch (err) {
        console.error('Greška prilikom dekodiranja tokena:', err);
      }
    }
  }, []);

  const handleGoToReservations = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      navigate(`/reservations/${userId}`);
    }
  };

  const handleAuthClick = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  if (localStorage.getItem('token') && role === null) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="home-container">
      <button onClick={handleAuthClick}>
        {localStorage.getItem('token') ? 'Odjava' : 'Prijava'}
      </button>

      <h1>Dobro došli u sustav za upravljanje voznim parkom</h1>
      <p>Ovdje možete upravljati vozilima, rezervacijama, i pregledavati status vaših zahtjeva.</p>

      <div className="home-actions">
        <button onClick={() => window.location.href = '/vehicles'}>
          Pregledaj vozila - svi
        </button>
        <hr />

        {role === 'admin' && (
          <>
            <button onClick={() => window.location.href = '/vehicles/add'}>Dodaj vozilo - admin</button>
            <button onClick={() => window.location.href = '/vehicles/damaged'}>Prijavljena šteta - admin</button>
            <button onClick={() => window.location.href = '/reservations'}>Sve rezervacije (odobri/odbij) - admin</button>
            <hr />
          </>
        )}

        {role === 'employee' && (
          <>
            <button onClick={() => navigate('/reservations/new')}>Kreiraj novu rezervaciju - zaposlenik</button>
            <button onClick={handleGoToReservations}>Pogledaj moje rezervacije - zaposlenik</button>
            <hr />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
