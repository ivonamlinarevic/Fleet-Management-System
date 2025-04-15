import React, { useState, useEffect } from 'react'; 
import { getVehicles } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Nema prijave');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    } catch (err) {
      setError('Neispravan token');
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
              <h3>{vehicle.maker} {vehicle.model} ({vehicle.type})</h3>
              <p>Godište: {vehicle.year}</p>
              <p>Registracijska oznaka: {vehicle.registrationNumber}</p>
              <p>Dostupnost: {vehicle.availabilityStatus}</p>

              {role === 'admin' && (
                <Link to={`/vehicles/${vehicle._id}`}>
                  <button>Uredi - admin</button>
                </Link>
              )}
              {role === 'employee' && (
                <button onClick={() => navigate(`/reservations/${vehicle._id}/damage`)}>
                  Prijavi kvar - zaposlenik
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vehicles;
