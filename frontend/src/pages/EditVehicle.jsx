import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    type: '',
    maker: '',
    model: '',
    year: '',
    registrationNumber: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`);
        setVehicleData(response.data);
      } catch (err) {
        setError('Greška pri dohvaćanju podataka vozila');
      }
    };

    fetchVehicleData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};
    for (const key in vehicleData) {
      if (vehicleData[key] !== '') {
        updatedData[key] = vehicleData[key];
      }
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setError('Niste prijavljeni');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/vehicles/${id}`,
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        }
      );
      setSuccess('Vozilo uspješno uređeno');
      setError(null);
      navigate('/vehicles'); 
    } catch (err) {
      setError('Greška pri uređivanju vozila');
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <div className="edit-vehicle-container">
      <h1>Uredi vozilo</h1>

      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tip:</label>
          <input
            type="text"
            name="type"
            value={vehicleData.type}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Proizvođač:</label>
          <input
            type="text"
            name="maker"
            value={vehicleData.maker}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Model:</label>
          <input
            type="text"
            name="model"
            value={vehicleData.model}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Godina:</label>
          <input
            type="number"
            name="year"
            value={vehicleData.year}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Registracijska oznaka:</label>
          <input
            type="text"
            name="registrationNumber"
            value={vehicleData.registrationNumber}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Spremi promjene</button>
      </form>
    </div>
  );
};

export default EditVehicle;
