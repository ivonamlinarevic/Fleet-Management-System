import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportDamage = () => {
  const { vehicleId } = useParams();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      return navigate('/login');
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/reservations/${vehicleId}/damage`,
        { damageDescription: description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      navigate('/vehicles');
    } catch (err) {
      setError('Greška 403! Samo zaposlenici mogu prijaviti kvar.');
    }
  };

  return (
    <div>
      <h2>Prijavi kvar vozila</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">Opis kvara:</label>
        <textarea
          id="description"
          rows="5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit">Pošalji prijavu</button>
      </form>
    </div>
  );
};

export default ReportDamage;
