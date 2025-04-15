import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useUser(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.token); 
      navigate('/');
    } catch (error) {
      setError('Neispravni podaci za prijavu'); 
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
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={() => navigate('/users/register')}>Registriraj se</button>
    </div>
  );
};

export default Login;
