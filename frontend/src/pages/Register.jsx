import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setError('Lozinka mora imati najmanje 8 znakova.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Unesite valjan email.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      const { token } = response.data;

      localStorage.setItem('token', token); 
      setSuccess('Registracija uspješna!');
      setError(null);
      setTimeout(() => {
        navigate('/login'); // Preusmjeravanje na stranicu za prijavu nakon 2 sekunde
      }, 1000); // Vrijeme čekanja prije preusmjeravanja
      //navigate('/'); 
    } catch (err) {
      setError('Greška pri registraciji. Pokušajte ponovo.');
      setSuccess(null);
    }
  };

  return (
    <div className="register-container">
      <h1>Registracija</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form className='actions' onSubmit={handleSubmit}>
        <div>
          <label>Ime: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Lozinka: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Registriraj se</button>
      </form>
    </div>
  );
};

export default Register;
