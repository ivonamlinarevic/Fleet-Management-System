import React, { useEffect, useState } from 'react';
import axios from 'axios';
 
const DamageReport = () => {
  const [damagedVehicles, setDamagedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDamagedVehicles = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await axios.get('http://localhost:5000/api/vehicles/damaged', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setDamagedVehicles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Došlo je do pogreške prilikom dohvaćanja vozila.');
        setLoading(false);
      }
    };

    fetchDamagedVehicles();
  }, []);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Vozila sa prijavljenom štetom</h1>
      {damagedVehicles.length === 0 ? (
        <p>Trenutno nema vozila sa prijavljenom štetom.</p>
      ) : ( <div className='reports'> 
        <table>
          <thead>
            <tr>
              <th>Tip</th>
              <th>Proizvođač</th>
              <th>Model</th>
              <th>Godina</th>
              <th>Registracijski broj</th>
              <th>Status</th>
              <th>Opis štete</th>
            </tr>
          </thead>
          <tbody>
            {damagedVehicles.map((vehicle) => (
              <tr key={vehicle._id}>
                <td>{vehicle.type}</td>
                <td>{vehicle.maker}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td>{vehicle.registrationNumber}</td>
                <td>{vehicle.availabilityStatus}</td>
                <td>{vehicle.damageDescription || 'Nema opisa'}</td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
      )}
    </div>
  );
};

export default DamageReport;
