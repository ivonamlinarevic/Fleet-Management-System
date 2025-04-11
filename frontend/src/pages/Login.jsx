import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api'; // Ovdje importaj tvoju login funkciju

const Login = () => {
  const navigate = useNavigate();  // Definiraj useNavigate za preusmjerenje
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funkcija za obradu prijave
  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token); // Pohrani token u localStorage
      navigate('/dashboard'); // Preusmjerenje nakon uspješne prijave
    } catch (error) {
      console.error('Greška pri prijavi:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
