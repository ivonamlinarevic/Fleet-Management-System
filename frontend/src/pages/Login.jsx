import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, user } = useUser(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Molimo unesite oba polja: email i lozinku');
      return;
    }
  
    try {
      await loginUser(email, password);
    } catch (error) {
      console.error('Greška pri prijavi:', error);
      setError('Pogrešan email ili lozinka');
    }
  };
  

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

const handleSubmit = (e) => {
  e.preventDefault();
  handleLogin(); // Pozivanje funkcije za prijavu
};

return (
<div className='actions'>
  <h1>Login</h1>
  <form onSubmit={handleSubmit}>
    <div>
      <label>Email: </label>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required
      />
    </div>
    <div>
      <label>Password: </label>
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required
      />
    </div>
    <button type="submit">Login</button>
  </form>

  {error && <p style={{ color: 'red' }}>{error}</p>}
  <p>Nemaš račun?</p>
  <button onClick={() => navigate('/users/register')}>Registriraj se</button>
</div>
);
}

export default Login;
