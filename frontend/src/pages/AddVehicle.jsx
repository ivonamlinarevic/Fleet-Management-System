import React, { useState } from 'react';
import axios from 'axios';

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    type: '',
    maker: '',
    model: '',
    year: '',
    registrationNumber: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Niste prijavljeni');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/vehicles/add',
        vehicleData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        }
      );
      setSuccess('Vozilo uspješno dodano');
      setError(null);
      console.log(response.data);
    } catch (err) {
      setError('Greška pri dodavanju vozila');
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="add-vehicle-container">
      <h1>Dodaj novo vozilo</h1>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="actions">
        <div>
          <label>Tip: </label>
          <input
            type="text"
            name="type"
            value={vehicleData.type}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Proizvođač: </label>
          <input
            type="text"
            name="maker"
            value={vehicleData.maker}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Model: </label>
          <input
            type="text"
            name="model"
            value={vehicleData.model}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Godina: </label>
          <input
            type="number"
            name="year"
            value={vehicleData.year}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Registracijska oznaka: </label>
          <input
            type="text"
            name="registrationNumber"
            value={vehicleData.registrationNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Dodaj vozilo</button>
      </form>
    </div>
  );
};

export default AddVehicle;
