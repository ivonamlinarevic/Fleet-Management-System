import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reservations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data);
    } catch (err) {
      setError('Greška pri dohvaćanju rezervacija.');
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reservations/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchReservations(); // refreshaj nakon ažuriranja
    } catch (err) {
      console.error('Greška pri ažuriranju statusa:', err);
    }
  };

  return (
    <div>
      <h1>Pregled svih rezervacija</h1>
      <div className="reports">
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Korisnik</th>
            <th>Vozilo</th>
            <th>Datum početka</th>
            <th>Datum kraja</th>
            <th>Svrha</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res._id}>
              <td>{res.user?.name || 'Nepoznato'}</td>
              <td>
                {res.vehicle?.maker} {res.vehicle?.model}
              </td>
              <td>{new Date(res.startDate).toLocaleDateString()}</td>
              <td>{new Date(res.endDate).toLocaleDateString()}</td>
              <td>{res.purpose}</td>
              <td>{res.status}</td>
              <td className='actions'>
                <button
                  onClick={() => updateStatus(res._id, 'approved')}
                >
                  Odobri
                </button>
                <button
                  onClick={() => updateStatus(res._id, 'rejected')}
                  >
                  Odbij
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default AdminReservations;
