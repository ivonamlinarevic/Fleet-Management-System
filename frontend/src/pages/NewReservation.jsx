import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewReservation = () => {
  const [vehicles, setVehicles] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Došlo je do pogreške pri dohvaćanju vozila.');
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const getCurrentDateTime = () => {
    const currentDate = new Date();
    const isoString = currentDate.toISOString();
    return isoString.slice(0, 16); // Uzimamo samo do minuta
  };

  // Provjera da krajnji datum nije prije početnog
  const handleEndDateChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate < startDate) {
      setError('Krajnji datum ne smije biti prije početnog datuma.');
    } else {
      setError('');
      setEndDate(selectedEndDate);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(endDate) < new Date(startDate)) {
      setError('Krajnji datum ne smije biti prije početnog datuma.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/reservations/new',
        { vehicleId, startDate, endDate, purpose },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
    } catch (err) {
      console.error(err);
      setError('Greška 403!');
    }
  };

  if (loading) {
    return <div>Učitavanje vozila...</div>;
  }

  return (
    <div>
      <h1>Kreiraj novu rezervaciju</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form className='actions' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vehicle">Vozilo: </label>
          <select
            id="vehicle"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            required
          >
            <option value="">Odaberite vozilo</option>
            {vehicles
            .filter((vehicle) => vehicle.availabilityStatus !== 'reserved')
            .map((vehicle) => (
            <option key={vehicle._id} value={vehicle._id}>
              {vehicle.model} ({vehicle.availabilityStatus})
            </option>
))}

          </select>
        </div>

        <div>
          <label htmlFor="startDate">Početni datum: </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            min={getCurrentDateTime()}
          />
        </div>

        <div>
          <label htmlFor="endDate">Krajnji datum: </label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={handleEndDateChange} // Koristimo novu funkciju za promjenu krajnjeg datuma
            required
            min={getCurrentDateTime()}
          />
        </div>

        <div>
          <label htmlFor="purpose">Svrha rezervacije: </label>
          <input
            type="text"
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
        </div>

        <button type="submit">Kreiraj rezervaciju</button>
      </form>
    </div>
  );
};

export default NewReservation;
