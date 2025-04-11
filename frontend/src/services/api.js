import axios from 'axios';

// Postavi osnovnu URL adresu za API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Prilagodi prema tvojoj backend adresi
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor za automatsko dodavanje Bearer tokena u zaglavlje svakog zahtjeva
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Preuzmi token iz localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Dodaj token u Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Funkcija za login korisnika
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Greška pri prijavi:', error);
    throw error;
  }
};

// Funkcija za dohvat svih vozila
export const getVehicles = async () => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.error('Greška pri dohvaćanju vozila:', error);
    throw error;
  }
};

// Ostale funkcije za API pozive mogu biti dodane ovdje...
