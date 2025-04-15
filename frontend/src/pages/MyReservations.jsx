import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await axios.get(`http://localhost:5000/api/reservations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReservations(response.data);
    } catch (error) {
      console.error('Greška prilikom dohvaćanja rezervacija:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations((prev) => prev.filter((r) => r._id !== reservationId));
    } catch (err) {
      console.error('Greška prilikom otkazivanja rezervacije:', err);
    }
  };

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div>
      <h2>Moje rezervacije</h2>
      {reservations.length === 0 ? (
        <p>Nemaš rezervacija.</p>
      ) : (
        <ul>

{reservations.map((reservation) => (
    <div key={reservation._id}>
        <h3>Vozilo: {reservation.vehicle.maker} {reservation.vehicle.model}</h3>
        <p>Tip: {reservation.vehicle.type}</p>
        <p>Registracija: {reservation.vehicle.registrationNumber}</p>
        <p>Status: {reservation.status}</p>
        <button onClick={() => handleCancel(reservation._id)}>Otkazivanje</button>
    </div>
))}
        </ul>
      )}
    </div>
  );
};

export default MyReservations;
