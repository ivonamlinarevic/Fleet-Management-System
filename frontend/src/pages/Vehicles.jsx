import React, { useState, useEffect } from 'react';
import { getVehicles } from '../services/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Nema prijave');
      return;
    }

    const fetchVehicles = async () => {
      try {
        const data = await getVehicles(token);
        setVehicles(data);
      } catch (err) {
        setError('Greška pri dohvaćanju vozila');
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div>
      <h2>Vozila</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {vehicles.length === 0 ? (
          <p>Nema dostupnih vozila</p>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle._id}>
              <h3>{vehicle.type} - {vehicle.make} {vehicle.model}</h3>
              <p>{vehicle.registrationNumber}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vehicles;
