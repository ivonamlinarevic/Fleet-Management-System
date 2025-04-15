import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reservations'); 
        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Došlo je do pogreške prilikom dohvaćanja rezervacija.');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/reservations/${id}/status`, { status });
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === id ? { ...reservation, status } : reservation
        )
      );
    } catch (err) {
      setError('Došlo je do pogreške pri ažuriranju statusa rezervacije.');
    }
  };

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Pregled svih rezervacija</h1>
      {reservations.length === 0 ? (
        <p>Nema rezervacija.</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation._id}>
              <p>Korisnik: {reservation.user.name}</p>
              <p>Vozilo: {reservation.vehicle.model}</p>
              <p>Svrha: {reservation.purpose}</p>
              <p>Status: {reservation.status}</p>
              {reservation.status === 'pending' && (
                <>
                  <button onClick={() => handleApproval(reservation._id, 'approved')}>Odobri</button>
                  <button onClick={() => handleApproval(reservation._id, 'rejected')}>Odbij</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reservations;
