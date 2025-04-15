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
        console.error('Greška pri dohvaćanju podataka o korisniku:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token, user } = response.data;

      setUser(user);
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      throw new Error('Greška pri prijavi');
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token')
  };

  return (
    <UserContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
