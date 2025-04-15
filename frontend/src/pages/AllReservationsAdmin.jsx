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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pregled svih rezervacija</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Korisnik</th>
            <th className="border px-4 py-2">Vozilo</th>
            <th className="border px-4 py-2">Datum početka</th>
            <th className="border px-4 py-2">Datum kraja</th>
            <th className="border px-4 py-2">Svrha</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res._id} className="text-center">
              <td className="border px-4 py-2">{res.user?.username || 'Nepoznato'}</td>
              <td className="border px-4 py-2">
                {res.vehicle?.maker} {res.vehicle?.model}
              </td>
              <td className="border px-4 py-2">{new Date(res.startDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{new Date(res.endDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{res.purpose}</td>
              <td className="border px-4 py-2">{res.status}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => updateStatus(res._id, 'approved')}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Odobri
                </button>
                <button
                  onClick={() => updateStatus(res._id, 'rejected')}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Odbij
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservations;
