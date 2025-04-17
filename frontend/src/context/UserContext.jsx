import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Greška pri dohvaćanju korisnika:', error);
        localStorage.removeItem('token'); // ako je token nevažeći
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const loginUser = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    setUser(user);

    return response.data;
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
