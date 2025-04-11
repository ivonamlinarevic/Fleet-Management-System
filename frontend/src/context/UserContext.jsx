import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Kreiranje UserContext
const UserContext = createContext();

// Provider komponenta koja omogućuje dijeljenje stanja korisnika
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Provjera tokena i dohvat podataka o korisniku kad se aplikacija učita
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
          setUser(response.data); // Spremi podatke o korisniku
        }
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka o korisniku:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Funkcija za login
  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token); // Pohranjivanje tokena u localStorage
  };

  // Funkcija za logout
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token'); // Uklanjanje tokena iz localStorage
  };

  return (
    <UserContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
